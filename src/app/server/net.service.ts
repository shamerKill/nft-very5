import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throttleTime } from 'rxjs';
import { environment } from 'src/environments/environment';

// 数据类型
type TypeInterfaceNet<T=any> = {
  code: number;
  data: T;
  msg?: string;
};

@Injectable({
  providedIn: 'root'
})
export class NetService {

  private apiUrl = environment.apiPath;
  private $url = (path: string) => `${this.apiUrl}${path}`;
  private $get = <T = TypeInterfaceNet>(
    url: string,
  ) => {
    return this.http.get<T>(this.$url(url), { withCredentials: true });
  };
  private $post = <T = TypeInterfaceNet>(
    url: string,
    body?: {
      [key: string]: string,
    }
  ) => {
    let fd: FormData|undefined;
    if (body) {
      fd = new FormData();
      Object.keys(body).forEach(key => {
        fd?.append(key, body[key]);
      });
    }
    return this.http.post<T>(this.$url(url), fd, { withCredentials: true });
  };

  constructor(
    private http: HttpClient,
  ) {
  }

  // 获取首页数据
  getHomeData$() {
    type _TypeReturn = TypeInterfaceNet<{
      artist: any[];
      ranking: {
        dayRanking: any[];
        monthRanking: any[];
        weekRanking: any[];
      };
      top: any[];
    }>;
    return this.$get<_TypeReturn>('v1/nft/index').pipe(throttleTime(1000));
  }

  /**
   * 登录接口
   **/
  // 此处调用时this指向错误，需用箭头函数
  signLogin$(message: string, signStr: string) {
    return this.$post('v1/auth/login', { signStr, message }).pipe(throttleTime(1000));
  }

  /**
   * 退出登录
   **/
  outLogin$() {
    return this.$post('v1/my/loginOut');
  }

  /**
   * 获取我创建的nft列表
   **/
  // 用来做判断是否存在登录状态
  getMyNFTList$() {
    return this.$get<TypeInterfaceNet>('v1/my/creatorNfts');
  }
  /** 
   * v1/collection/list
   * owner 地址
   * category 分类
   * 合集-列表(查询条件)
   * **/
  getCollectionList$(owner:string,category:string) {
    return this.$get<TypeInterfaceNet>(`v1/collection/list?owner=${owner}&category=${category}`);
  }
  /** 
   * v1/nft/list
   * creator 创建者
   * category 类别-多选(用"，"隔开"）
   * sellingType 挂单状态(1：一口价，2：拍卖，3：（拍卖，有出价)） 多选用","隔开
   * lowPrice 低价一价格筛选
   * highPrice 高价一价格筛选
   * coinType 币种类型
   * collectionName 合集名称
   * sort 排序(1最近转移,2最近上架,3最近创建，4最近卖出，5最近结束,6价格从低到高，7价格从高到低，8销售最高）
   * nft-列表(查询条件)
   * **/
   getNftList$(creator:string,category:string,sellingType:string,lowPrice:string|number,highPrice:string|number,coinType:string,collectionName:string,sort:string,) {
    return this.$get<TypeInterfaceNet>(`v1/nft/list?creator=${creator}&category=${category}&sellingType=${sellingType}&lowPrice=${lowPrice}&highPrice=${highPrice}&coinType=${coinType}&collectionName=${collectionName}&sort=${sort}`);
  }

}