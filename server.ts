import express, { Express, Request, Response } from 'express';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ES 모듈 환경에서 __dirname을 사용하기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일에서 환경 변수를 로드합니다.
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(express.json());

// --- Google OAuth 2.0 설정 ---
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // 이 리디렉션 URI는 Google Cloud Console에 등록된 것과 정확히 일치해야 합니다.
  // 실제 배포 시에는 Cloud Run 서비스의 URL로 설정됩니다.
  process.env.REDIRECT_URI || 'http://localhost:8080/auth/google/callback'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Google 로그인 창으로 사용자를 리디렉션하는 경로
app.get('/auth/google', (req: Request, res: Response) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    // refresh_token을 항상 받기 위한 옵션
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
    oauth2Client.setCredentials(tokens);
    // 실제 앱에서는 이 토큰을 사용자 세션이나 DB에 안전하게 저장해야 합니다.
    // 이 예제에서는 간단함을 위해 서버 메모리에 유지합니다.
    console.log('Google 인증 성공!');
    res.redirect('/'); // 인증 후 메인 페이지로 리디렉션
  } catch (error) {
    console.error('인증 중 오류 발생:', error);
    res.status(500).send('인증에 실패했습니다.');
  }
});


// --- API 엔드포인트 ---

// 할 일 목록 가져오기 (실제 구현)
app.get('/api/todos', async (req: Request, res: Response) => {
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(), // 지금 이후의 이벤트만 가져옴
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items;
        if (!events || events.length === 0) {
            return res.json([]);
        }

        const todos = events.map(event => ({
            id: event.id,
            eventId: event.id,
            title: event.summary,
            completed: false, // 캘린더 이벤트에는 '완료' 상태가 없으므로 기본값 설정
            dateTime: event.start?.dateTime || event.start?.date,
        }));

        res.json(todos);
    } catch (error) {
        console.error('Google Calendar 이벤트 조회 오류:', error);
        res.status(500).json({ error: '캘린더에서 이벤트를 가져오지 못했습니다.' });
    }
});

// 할 일 추가하기
app.post('/api/todos', async (req: Request, res: Response) => {
  const { title, dateTime } = req.body;

  if (!title || !dateTime) {
    return res.status(400).json({ error: '제목과 날짜/시간이 필요합니다.' });
  }

  try {
    const eventStartTime = new Date(dateTime);
    // 이벤트 종료 시간을 시작 시간으로부터 1시간 뒤로 설정
    const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: title,
      start: {
        dateTime: eventStartTime.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      end: {
        dateTime: eventEndTime.toISOString(),
        timeZone: 'Asia/Seoul',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 }, // 1일 전
          { method: 'popup', minutes: 2 * 60 },  // 2시간 전
          { method: 'popup', minutes: 30 },     // 30분 전
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    
    const createdEvent = response.data;

    // 프론트엔드에 필요한 형식으로 응답을 보냅니다.
    res.status(201).json({
        id: createdEvent.id,
        eventId: createdEvent.id,
        title: createdEvent.summary,
        completed: false, // 새 할 일은 항상 false
        dateTime: createdEvent.start?.dateTime
    });

  } catch (error) {
    console.error('Google Calendar 이벤트 생성 오류:', error);
    res.status(500).json({ error: '캘린더에 이벤트를 생성하지 못했습니다.' });
  }
});

// 할 일 삭제하기
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: id,
        });
        console.log(`이벤트 삭제됨: ${id}`);
        res.status(200).json({ id });
    } catch (error) {
        console.error(`이벤트 삭제 오류 (ID: ${id}):`, error);
        res.status(500).json({ error: '캘린더 이벤트를 삭제하지 못했습니다.' });
    }
});


// --- 프론트엔드 제공 ---
// Vite로 빌드된 정적 파일들을 제공합니다.
const clientPath = path.join(__dirname, '..', 'dist');
app.use(express.static(clientPath));

// 다른 모든 GET 요청은 프론트엔드의 index.html로 보냅니다. (React Router를 위함)
// Fix: Add explicit types for req and res to resolve overload error.
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});