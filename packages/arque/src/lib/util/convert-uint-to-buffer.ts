export default function (value: number) {
  const buffer = Buffer.alloc(4, 0);
  buffer.writeUIntBE(value, 0, 4);

  return buffer;
}
