# 소피의세계

Astro 기반의 개인 블로그입니다.

## Structure

- `/`: 소피의세계
- `/posts`: 글
- `/notes`: 조각글

콘텐츠는 `src/content/posts`와 `src/content/notes`에 Markdown 파일로 추가합니다.
`draft: true`인 글과 조각글은 목록과 빌드 결과에서 제외됩니다.

조각글은 Threads/Twitter 스타일의 이미지 그리드를 지원합니다.

```yaml
images:
  - src: "/images/example.jpg"
    alt: "이미지 설명"
    caption: "선택 캡션"
```

## Development

Astro 6은 Node.js `22.12.0` 이상이 필요합니다.

```sh
nvm use
npm install
npm run dev
```

검증은 아래 명령으로 실행합니다.

```sh
npm run check
npm run build
```
