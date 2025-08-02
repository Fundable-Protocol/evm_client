// TODO: Add types for payment stream

/*

    name: "",
    recipient: "",
    token: tokenOptions[0].value,
    duration: durationOptions[0].value,
    durationValue: "",
    cancellability: false,
    transferability: false,

*/

export interface StreamData {
  name: string;
  recipient: string;
  token: string;
  duration: string;
  durationValue: string;
  cancellability: boolean;
  transferability: boolean;
}
