/**
 * 텍스트 내 URL을 <a> 태그로 변환하고, 줄바꿈을 <br />로 변환합니다.
 * 생성된 링크는 globals.scss의 .external-link 클래스를 사용합니다.
 */
export function linkify(text: string): string {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text
    .replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="external-link">${url}</a>`;
    })
    .replace(/\n/g, "<br />");
}
