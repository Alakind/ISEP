import {ReactNode} from "react";

function InfoSupportMailSupport({element, inviteId}: Readonly<Props>) {
  return (
    <a
      href={`mailto:recruiter@infosupport.com?subject=Support request for [[NAME]] for assessment (${inviteId ?? "?"})&body=Dear InfoSupport employee,%0D%0A %0D%0A I require support on the assessment, because of the following reason(s):%0D%0A %0D%0A %0D%0A Kind regards, %0D%0A`}>
      {element}
    </a>
  );
}

interface Props {
  element: string | ReactNode;
  inviteId: string | null;
}

export default InfoSupportMailSupport;
