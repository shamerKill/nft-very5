import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throttleTime } from 'rxjs';
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
    return this.http.get<_TypeReturn>(this.$url('v1/nft/index'))
            .pipe(throttleTime(1000));
  }

  /**
   * 登录接口
   **/
  // 此处调用时this指向错误，需用箭头函数
  signLogin$(message: string, signStr: string) {
    const fd = new FormData();
    fd.append('signStr', signStr);
    fd.append('message', message);
    return this.http.post<TypeInterfaceNet>(this.$url('v1/auth/login'), fd).pipe(throttleTime(1000));
  }

  /**
   * 退出登录
   **/
  outLogin$() {
    return this.http.post<TypeInterfaceNet>(this.$url('v1/my/loginOut'), null, { withCredentials: true });
  }

}
