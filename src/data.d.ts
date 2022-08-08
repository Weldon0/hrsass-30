export interface UserInfoData {
  /**
   * 业务状态码，10000成功, 其他失败
   */
  code: number;
  /**
   * 响应数据
   */
  data: Data;
  /**
   * 响应消息
   */
  message: string;
  /**
   * 响应状态
   */
  success: boolean;
}

/**
 * 响应数据
 */
export interface Data {
  /**
   * 用户所在公司名
   */
  company: string;
  /**
   * 用户所在公司id
   */
  companyId: string;
  /**
   * 用户手机号
   */
  mobile: string;
  /**
   * 用户权限点对象
   */
  roles: Roles;
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

/**
 * 用户权限点对象
 */
export interface Roles {
  /**
   * 接口权限点数组，每个字符串, 是用项目设置的, 标记英文字符串
   */
  apis: string[];
  /**
   * 路由权限点数组，每个字符串, 是用项目设置的, 标记英文字符串
   */
  menus: string[];
  /**
   * 按钮权限点数组，每个字符串, 是用项目设置的, 标记英文字符串
   */
  points: string[];
}
