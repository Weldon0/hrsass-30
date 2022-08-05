declare module CompanyInfo {
  interface RootObject {
    success: boolean;
    code: number;
    data: Data;
    message: string;
  }
  interface Data {
    id: string;
    name: string;
    managerId: string;
    version: string;
    renewalDate?: any;
    expirationDate?: any;
    companyArea?: any;
    companyAddress: string;
    businessLicenseId?: any;
    legalRepresentative: string;
    companyPhone: string;
    mailbox: string;
    companySize?: any;
    industry?: any;
    remarks: string;
    auditState: string;
    state: number;
    balance: number;
    createTime: string;
  }

}
