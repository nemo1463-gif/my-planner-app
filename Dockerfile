# 1단계: 빌드 환경 설정 (코드를 완성품으로 조립하는 단계)
# Node.js 18 버전을 사용하는 가상 작업 공간을 만듭니다.
FROM node:18-slim AS build

# 작업할 폴더를 /app으로 지정합니다.
WORKDIR /app

# package.json 파일을 먼저 복사합니다.
COPY package*.json ./

# 필요한 모든 부품(라이브러리)을 설치합니다.
RUN npm install

# 나머지 모든 소스 코드를 복사합니다.
COPY . .

# package.json에 정의된 "build" 명령어를 실행하여
# 프론트엔드(dist)와 백엔드(dist-server)를 완성품으로 만듭니다.
RUN npm run build


# 2단계: 실행 환경 설정 (완성품을 실제 작동시키는 단계)
# 더 가볍고 안전한 Node.js 환경을 새로 만듭니다.
FROM node:18-slim

# 작업할 폴더를 /app으로 지정합니다.
WORKDIR /app

# 1단계(빌드 환경)에서 설치했던 부품(node_modules)만 복사해옵니다.
COPY --from=build /app/node_modules ./node_modules

# 1단계에서 완성한 백엔드 서버 코드(dist-server)를 복사해옵니다.
COPY --from=build /app/dist-server ./dist-server

# 1단계에서 완성한 프론트엔드 UI 코드(dist)를 복사해옵니다.
COPY --from=build /app/dist ./dist

# 이 컨테이너가 외부와 통신할 포트를 8080으로 지정합니다. (Cloud Run 기본값)
EXPOSE 8080

# 컨테이너가 시작될 때, 완성된 백엔드 서버를 실행하라고 명령합니다.
CMD ["node", "dist-server/server.js"]