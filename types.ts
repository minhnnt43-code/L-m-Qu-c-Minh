
export interface TextElement {
  id: number;
  name: string;
  text: string;
  fontSize: number;
  color: string;
  position: { x: number; y: number };
  fontFamily: string;
}

export interface GeneratedCertificate {
  name: string;
  dataUrl: string;
}
