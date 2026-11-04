export function TwoToneHeading({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  const middle = Math.ceil(words.length / 2);
  return <>{words.slice(0, middle).join(' ')}{' '}<span className="heading-accent">{words.slice(middle).join(' ')}</span></>;
}
