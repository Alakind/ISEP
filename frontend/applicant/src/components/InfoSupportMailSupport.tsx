import {ReactNode} from "react";

function InfoSupportMailSupport({element, inviteId, name}: Readonly<Props>) {
  return (
    <a
      href={`mailto:recruiter@infosupport.nl?subject=Support request for ${name ?? "[[NAME]]"} for assessment (${inviteId ?? "?"})&body=Dear InfoSupport employee,%0D%0A %0D%0A I require support on the assessment, because of the following reason(s):%0D%0A %0D%0A %0D%0A Kind regards, %0D%0A ${name ?? "[[NAME]]"}`}>
      {element}
    </a>
  );
}

interface Props {
  element: string | ReactNode;
  inviteId: string | null;
  name: string | null;
}

export default InfoSupportMailSupport;
