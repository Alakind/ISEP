function CheckboxLoading({ id }: Props) {
  return (
    <input
      className={`checkbox__input checkbox__input--loading`}
      id={id}
      type={"checkbox"}
      disabled={true}
    />
  )
}

interface Props {
  id: string;
}

export default CheckboxLoading
