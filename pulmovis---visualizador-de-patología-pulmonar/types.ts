export enum PathologyType {
  NORMAL = 'NORMAL',
  DERRAME_PLEURAL = 'DERRAME_PLEURAL',
  ATELECTASIA = 'ATELECTASIA',
  NEUMONIA_ALVEOLAR = 'NEUMONIA_ALVEOLAR',
  NEUMONIA_DIFUSA = 'NEUMONIA_DIFUSA',
  NEUMOTORAX = 'NEUMOTORAX'
}

export interface PathologyInfo {
  id: PathologyType;
  name: string;
  shortDescription: string;
}

export interface GeminiResponse {
  description: string;
  symptoms: string[];
  radiographicFeatures: string[];
  treatment: string;
}
