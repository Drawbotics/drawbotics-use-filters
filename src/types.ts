export interface Filter {
  readonly value: string | undefined;
  readonly values: Array<string> | undefined;
  readonly set: (value: string | string[] | null) => void;
}
