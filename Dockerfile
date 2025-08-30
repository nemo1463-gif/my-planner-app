# Google Cloud Console에서 발급받은 OAuth 2.0 클라이언트 ID
GOOGLE_CLIENT_ID="여기에-클라이언트-ID를-붙여넣으세요.apps.googleusercontent.com"

# Google Cloud Console에서 발급받은 클라이언트 보안 비밀
GOOGLE_CLIENT_SECRET="여기에-클라이언트-보안-비밀을-붙여넣으세요"

# 개발 환경(내 컴퓨터)에서 테스트할 때 사용할 리디렉션 주소
# server.ts 파일의 기본값과 일치해야 합니다.
REDIRECT_URI="http://localhost:8080/auth/google/callback"