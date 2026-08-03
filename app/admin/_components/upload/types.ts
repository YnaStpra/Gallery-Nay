export type UploadFormState = {
  allowDownload: boolean;
  cameraProfile: string;
  photographerNotes: string;
  title: string;
  slug: string;
  description: string;
  shootingConditions: string;
  shootingChallenges: string;
  waitingTime: string;
  interestingFacts: string;
  behindTheShot: string;
  altText: string;
  location: string;
  country: string;
  takenAt: string;
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  dominantColor: string;
  colorProfile: string;
  copyright: string;
  collection: string;
  editingSoftware: string;
  isPremium: boolean;
  lutDescription: string;
  lutFileName: string;
  lutFormat: string;
  lutName: string;
  lutVersion: string;
  originalFileName: string;
  metadataJson: string;
};

export type UploadDraft = {
  form: UploadFormState;
  selectedFileName: string;
  selectedPresetName: string;
  selectedOriginalName: string;
  metadataStatus: "idle" | "loading" | "ready" | "error";
  metadataMessage: string;
};

