import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-4 my-12 max-w-3xl mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/terms">약관</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>개인정보 처리 방침</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold mb-4">개인 정보 처리 방침</h1>
      <div className="prose prose-sm max-w-none">
        <section>
          <h2 className="text-xl font-semibold mt-6 mb-3">
            개인정보의 수집 및 처리
          </h2>

          <h3 className="text-lg font-medium mt-4 mb-2">
            1. 개인정보 수집 항목
          </h3>
          <p className=" mb-3">
            당사는 서비스 제공 및 회원 관리를 위하여 다음과 같은 최소한의 정보를
            수집 및 저장합니다.
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>① 사용자가 입력한 이메일 주소</li>
            <li>② 사용자가 직접 설정한 닉네임</li>
            <li>
              ③ 사이트에서 사용자의 활동 목적 및 권한에 따라 부여한 역할(Role)
              정보
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            2. 제3자 서비스(Supabase) 사용에 따른 정보 처리 안내
          </h3>
          <p className=" mb-3">
            본 사이트는 데이터 저장 및 인증, 세션 관리를 위하여 Supabase
            서비스를 사용하고 있으며, Supabase는 서비스 운영 과정에서 다음과
            같은 정보를 자동으로 수집할 수 있습니다.
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>① IP 주소</li>
            <li>② 브라우저 쿠키 정보</li>
            <li>③ 접속한 기기의 운영체제, 브라우저 종류 등 기술적 정보</li>
          </ul>
          <p className=" mb-3">
            이러한 정보는 Supabase의 자체적인 로그 수집 및 보안 목적을 위해
            사용되며, 본 사이트는 해당 정보를 직접 수집하거나 저장하지 않습니다.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">
            3. 개인정보의 수집 목적
          </h3>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>① 회원 식별 및 본인 확인</li>
            <li>② 서비스 제공 및 이용 내역 관리</li>
            <li>③ 사용자 간 상호작용 지원 및 커뮤니티 운영</li>
            <li>④ 시스템 보안 강화 및 비정상적인 접근 탐지</li>
            <li>⑤ 법적 의무 이행 및 분쟁 대응을 위한 증빙 자료 확보</li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            4. 개인정보 보관 및 이용 기간
          </h3>
          <p className=" mb-3">
            사용자의 개인정보는 회원 탈퇴 요청 시까지 보관되며, 탈퇴 후에는 지체
            없이 파기됩니다. 단, 관련 법령에서 별도로 정한 보관 기간이 있는
            경우에는 해당 기간 동안 보관될 수 있습니다.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">
            5. 개인정보 제공 및 제3자 제공
          </h3>
          <p className=" mb-3">
            당사는 원칙적으로 사용자의 개인정보를 제3자에게 제공하지 않습니다.
            단, 아래의 경우는 예외로 합니다.
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>① 사용자의 사전 동의를 받은 경우</li>
            <li>② 관계 법령에 따라 요청이 있는 경우</li>
            <li>
              ③ 서비스 제공을 위한 위탁이 필요한 경우(이 경우에도 최소한의
              정보만 제공하며, 위탁사에 대한 관리·감독을 철저히 수행합니다)
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">
            6. 회원의 책임 및 유의사항
          </h3>
          <p className=" mb-3">
            사용자는 본인의 개인정보를 항상 정확하고 최신 상태로 유지할 책임이
            있으며, 부정확하거나 허위로 입력된 정보로 인해 발생한 불이익에
            대해서는 당사가 책임지지 않습니다.
          </p>

          <h3 className="text-lg font-medium mt-4 mb-2">7. 면책 조항</h3>
          <p className=" mb-3">
            당사는 관련 법령 및 보안 규정을 준수하여 개인정보 보호에 최선을
            다합니다. 그러나 다음의 경우에는 책임을 지지 않습니다.
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>① 사용자의 과실 또는 고의에 따른 개인정보 유출</li>
            <li>
              ② 당사의 합리적인 보호조치를 초과한 불가항력적 사유(해킹, 천재지변
              등)로 인한 유출
            </li>
            <li>
              ③ Supabase 등 제3자 서비스가 자체적으로 수집한 정보 처리에 대해 본
              사이트가 통제할 수 없는 경우
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4 mb-2">8. 개정 및 고지</h3>
          <p className=" mb-3">
            본 방침은 관계 법령의 개정이나 내부 정책 변경에 따라 수정될 수
            있으며, 변경 시에는 사이트 내 공지를 통해 사전 안내됩니다. 변경
            이후에도 서비스를 계속 이용하는 경우, 변경 내용에 동의한 것으로
            간주됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
