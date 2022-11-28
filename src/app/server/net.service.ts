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

}
