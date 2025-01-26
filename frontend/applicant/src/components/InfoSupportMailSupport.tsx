function InfoSupportMailSupport({element}: Readonly<Props>) {
  return (
    <a
      href="mailto:info@infosupport.com?subject=Support request for <TODO replace name> for questionnaire&body=Dear InfoSupport employee,%0D%0A %0D%0A I require support on the questionnaire, because of the following reason(s):%0D%0A <REASONS> %0D%0A %0D%0A Kind regards, %0D%0A <TODO replace name>">
      {element}
    </a>
  );
}

interface Props {
  element: string | React.ReactNode;
}

export default InfoSupportMailSupport;
