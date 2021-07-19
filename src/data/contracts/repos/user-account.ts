export interface LoadUserAccountRepo {
  load: (params: LoadUserAccountRepo.Params) => Promise<LoadUserAccountRepo.Result>
}

export namespace LoadUserAccountRepo {
  export type Params = {
    email: string
  }
  export type Result = undefined
}

export interface CreateFacebookAccountRepo {
  createFromFacebook: (params: CreateFacebookAccountRepo.Params) => Promise<CreateFacebookAccountRepo.Result>
}

export namespace CreateFacebookAccountRepo {
  export type Params = {
    email: string
    name: string
    facebookId: string
  }
  export type Result = undefined
}
