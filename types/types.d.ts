declare interface req {
  params?: any;
  body?: user;
}
declare interface id {
  user: number;
}

export interface userid {
  userid: any;
}

declare interface social {
  id: number;
  userid?: number;
  github?: string;
  instagram?: string;
  facebook?: string;
  discord?: string;
  linkedin?: string;
  whatsapp?: string;
  twitter?: string;
}

declare interface user {
  uuid?: string;
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  refreshTokens: refreshToken[];
  social: social[];
}

declare interface refreshToken {
  id?: string;
  hashedToken?: string;
  userId?: number;
  user?: user;
  revoked?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    decoded: user;
    user: any;
  }
}
