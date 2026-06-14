import { application } from "express";

export enum USER_ROLES {
  USER= "user",
  ADMIN= "admin",
  GUEST= "guest",
};

export enum GENDER {
  MALE= "male",
  FEMALE= "female",
};

export enum STATUS {
  ACTIVE= "active",
  INACTIVE= "inactive",
};

export enum TOKEN_TYPES {
  ACCESS= "access",
  REFRESH = "refresh",
}

export enum PROVIDERS {
  SYSTEM= "system",
  GOOGLE= "google",   
  FACEBOOK= "facebook",
  APPLE= "apple", 
}


export enum CHANNELS {
    EMAIL='email',
    PHONE='phone'
}

export enum POST_PRIVACY{
  PUBLIC="public",
 PRIVATE='private',
 ONLY_ME ='only_me'
}

