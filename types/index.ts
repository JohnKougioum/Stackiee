export interface PostData {
  _id: string
  user: string
  title: string
  body: string
  semester: string
  course: string
  createdAt: string
  __v: number
  comments: number
}

export interface IhuApiProfile {
  uid: string
  am: string
  regyear: string
  regsem: string
  'givenName;lang-el': string
  'sn;lang-el': string
  'fathersname;lang-el': string
  eduPersonAffiliation: string
  eduPersonPrimaryAffiliation: string
  title: string
  'title;lang-el': string
  'cn;lang-el': string
  cn: string
  sn: string
  givenName: string
  fathersname: string
  secondarymail: string
  telephoneNumber: string
  labeledURI: string
  id: string
  mail: string
  pwdChangedTime: string
  sem: string
  socialMedia: {
    socialMediaExtra: any[]
  }
  profilePhoto: string
}
