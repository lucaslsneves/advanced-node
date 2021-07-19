export interface LoadUserAccountRepo {
  load: (params: loadUserAccountRepo.Params) => Promise<void>
}

export namespace loadUserAccountRepo {
  export type Params = {
    email: string
  }
}
