

// FIX: Combined express imports into a single statement and removed 'type' keyword.
// The previous type-only import for Express types was preventing TypeScript from
// correctly resolving module augmentations from libraries like 'express-session',
// leading to numerous type errors. This change ensures proper type resolution.
// FIX: Removed aliases for Request and Response types from the import statement and updated all route handlers to use the base `Request` and `Response` types directly. This allows TypeScript's type augmentation to work correctly, fixing errors where properties like `session`, `status`, `json`, etc., were not found.
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// Augment express-session to add a 'tokens' property to the SessionData
declare module 'express-session' {
  interface SessionData {
    tokens?: any; // You can define a more specific type for tokens
  }
}

// ES 모듈 환경에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일에서 환경 변수를 로드합니다.
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-super-strong-secret-key-that-is-long', // In production, use a strong secret from env vars
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  } 
}));


// --- Google OAuth 2.0 설정 ---
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI || 'http://localhost:8080/auth/google/callback'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// 로그인 상태를 확인하고, 인증된 경우 요청에 대한 자격 증명을 설정하는 미들웨어
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.tokens) {
    oauth2Client.setCredentials(req.session.tokens);
    return next();
  }
  res.status(401).json({ error: '인증되지 않았습니다. 먼저 로그인해주세요.' });
};


// --- 인증 관련 라우트 ---

// Google 로그인 창으로 사용자를 리디렉션하는 경로
app.get('/auth/google', (req: Request, res: Response) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
  res.redirect(url);
});

// Google 로그인 후 리디렉션되는 콜백 경로
app.get('/auth/google/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('인증 코드가 없습니다.');
  }
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    req.session.tokens = tokens; // Store tokens in session
    console.log('Google 인증 성공! 세션에 토큰 저장됨.');
    res.redirect('/');
  } catch (error) {
    console.error('인증 중 오류 발생:', error);
    res.status(500).send('인증에 실패했습니다.');
  }
});

// 프론트엔드에서 현재 로그인 상태를 확인할 수 있는 API
app.get('/api/auth/status', (req: Request, res: Response) => {
    if (req.session.tokens) {
        res.json({ isAuthorized: true });
    } else {
        res.json({ isAuthorized: false });
    }
});


// --- API 엔드포인트 (이제 인증 미들웨어로 보호됩니다) ---

// 할 일 목록 가져오기
app.get('/api/todos', isAuthenticated, async (req: Request, res: Response) => {
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items;
        if (!events || events.length === 0) return res.json([]);
        
        const todos = events
          .filter(event => event.id && event.summary && (event.start?.dateTime || event.start?.date))
          .map(event => ({
            id: event.id!,
            eventId: event.id!,
            title: event.summary!,
            completed: false,
            dateTime: event.start?.dateTime || event.start?.date!,
        }));
        res.json(todos);
    } catch (error) {
        console.error('Google Calendar 이벤트 조회 오류:', error);
        res.status(500).json({ error: '캘린더에서 이벤트를 가져오지 못했습니다.' });
    }
});

// 할 일 추가하기
app.post('/api/todos', isAuthenticated, async (req: Request, res: Response) => {
  const { title, dateTime } = req.body;
  if (!title || !dateTime) {
    return res.status(400).json({ error: '제목과 날짜/시간이 필요합니다.' });
  }

  try {
    const eventStartTime = new Date(dateTime);
    const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const event = {
      summary: title,
      start: { dateTime: eventStartTime.toISOString(), timeZone: 'Asia/Seoul' },
      end: { dateTime: eventEndTime.toISOString(), timeZone: 'Asia/Seoul' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 },
          { method: 'popup', minutes: 2 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({ calendarId: 'primary', requestBody: event });
    const createdEvent = response.data;

    // 응답을 보내기 전에 데이터 유효성 검사
    if (!createdEvent.id || !createdEvent.summary || !createdEvent.start?.dateTime) {
        console.error('Google Calendar API에서 생성된 이벤트에 필수 필드가 누락되었습니다.');
        return res.status(500).json({ error: '이벤트 생성 후 데이터 처리 중 오류가 발생했습니다.' });
    }

    res.status(201).json({
        id: createdEvent.id,
        eventId: createdEvent.id,
        title: createdEvent.summary,
        completed: false,
        dateTime: createdEvent.start.dateTime
    });
  } catch (error) {
    console.error('Google Calendar 이벤트 생성 오류:', error);
    res.status(500).json({ error: '캘린더에 이벤트를 생성하지 못했습니다.' });
  }
});

// 할 일 삭제하기
app.delete('/api/todos/:id', isAuthenticated, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await calendar.events.delete({ calendarId: 'primary', eventId: id });
        res.status(200).json({ id });
    } catch (error) {
        console.error(`이벤트 삭제 오류 (ID: ${id}):`, error);
        res.status(500).json({ error: '캘린더 이벤트를 삭제하지 못했습니다.' });
    }
});


// --- 프론트엔드 제공 ---
// API 라우트 뒤, 그리고 와일드카드 라우트 앞에 위치해야 합니다.
const clientPath = path.resolve(__dirname, '..', 'dist');
app.use(express.static(clientPath));

// 다른 모든 GET 요청은 프론트엔드 앱으로 전달
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(clientPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
