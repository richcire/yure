import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TermsOfService() {
  return (
    <div className="min-h-screen p-4 my-12 max-w-3xl mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/terms">약관</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>서비스 약관</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold mb-4">서비스 약관</h1>
      <div className="prose prose-sm max-w-none">
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">제1조 (목적)</h2>
          <p className="mb-3">
            본 약관은 유레(이하 "사이트")가 제공하는 서비스의 이용과 관련하여,
            사이트와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을
            규정함을 목적으로 합니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">제2조 (정의)</h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              ① "회원"이라 함은 본 약관에 동의하고 사이트가 제공하는 서비스를
              이용하는 자를 의미합니다.
            </li>
            <li>
              ② "서비스"라 함은 사이트가 온라인을 통해 제공하는 모든 기능과
              콘텐츠를 의미합니다.
            </li>
            <li>
              ③ "역할(Role)"이라 함은 사이트에서 부여한 회원의 권한 및 기능
              범위를 의미합니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            제3조 (약관의 효력 및 변경)
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>① 본 약관은 사이트에 게시함으로써 효력이 발생합니다.</li>
            <li>
              ② 사이트는 필요한 경우 관련 법령을 위반하지 않는 범위 내에서 본
              약관을 변경할 수 있으며, 변경된 약관은 사이트에 게시함으로써
              회원에게 공지한 것으로 간주됩니다.
            </li>
            <li>
              ③ 변경된 약관에 동의하지 않을 경우, 회원은 서비스 이용을 중단하고
              탈퇴할 수 있습니다. 별도 이의 제기 없이 서비스를 계속 이용하는
              경우, 변경 사항에 동의한 것으로 간주됩니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            제4조 (서비스의 제공 및 변경)
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              ① 사이트는 회원에게 다양한 기능, 콘텐츠, 커뮤니티 공간 등을
              제공합니다.
            </li>
            <li>
              ② 사이트는 서비스의 일부 또는 전부를 사전 통지 없이 변경하거나
              중단할 수 있으며, 이에 따라 발생하는 손해에 대해 책임을 지지
              않습니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            제5조 (개인정보의 수집 및 처리)
          </h2>
          <p className="mb-3">
            본 사이트는 서비스 제공을 위하여 다음의 최소한의 정보를 수집 및
            저장합니다:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>① 이메일 주소</li>
            <li>② 사용자가 설정한 닉네임</li>
            <li>③ 사이트 내에서 부여된 역할(Role)</li>
          </ul>

          <p className="mb-3">
            또한, 사이트는 Supabase를 통해 서비스를 운영하며, Supabase는 별도로
            사용자의 IP 주소, 쿠키, 브라우저 정보 등을 수집할 수 있습니다.
            이러한 정보는 사이트가 직접 수집하거나 저장하지 않으며, 해당 정보
            처리에 대해서는 Supabase의 방침에 따릅니다.
          </p>

          <p className="mb-3">
            그 외 개인정보의 처리에 관한 자세한 사항은
            <strong>개인정보처리방침</strong>에서 별도로 정하며, 본 약관과
            동일한 효력을 갖습니다.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            제6조 (회원의 의무)
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              ① 회원은 본 약관 및 관계 법령을 준수하여야 하며, 다음 행위를
              하여서는 안 됩니다:
            </li>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>1. 허위 정보의 등록</li>
              <li>2. 타인의 개인정보 도용 또는 명의 도용</li>
              <li>3. 사이트의 운영을 방해하는 행위</li>
              <li>4. 불법적인 정보의 게시 또는 유포</li>
            </ul>
            <li>
              ② 회원의 위반 행위로 인해 사이트 또는 제3자에게 손해가 발생한
              경우, 해당 회원은 그 책임을 부담합니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            제7조 (사이트의 면책)
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              ① 사이트는 천재지변, 해킹 등 불가항력적인 사유로 인한 서비스
              중단에 대하여 책임을 지지 않습니다.
            </li>
            <li>
              ② 사이트는 회원의 귀책사유로 인한 서비스 이용 장애에 대해 책임을
              지지 않으며, 회원이 입력한 정보의 정확성에 대해 일체의 책임을 지지
              않습니다.
            </li>
            <li>
              ③ 사이트는 Supabase 등 제3자 플랫폼이 자체적으로 수집하거나 처리한
              정보에 대하여 직접적인 책임을 지지 않으며, 해당 플랫폼의 약관 및
              정책에 따릅니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            제8조 (지식재산권)
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              ① 사이트에 게시된 모든 콘텐츠 및 저작물의 지식재산권은 사이트 또는
              정당한 권리자에게 귀속됩니다.
            </li>
            <li>
              ② 회원은 서비스를 이용함으로써 얻은 정보를 사전 승인 없이 복제,
              배포, 전송, 출판, 방송 기타 방법으로 이용하거나 제3자에게
              제공하여서는 안 됩니다.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-3">
            제9조 (약관의 해석 및 준거법)
          </h2>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              ① 본 약관의 해석 및 적용에 관하여는 대한민국 법령을 따릅니다.
            </li>
            <li>
              ② 서비스 이용과 관련하여 사이트와 회원 간에 분쟁이 발생한 경우,
              원만한 해결을 위하여 상호 협의하되, 해결이 어려운 경우
              민사소송법에 따라 관할 법원에 제소할 수 있습니다.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
