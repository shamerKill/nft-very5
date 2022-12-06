import { DatabaseService } from './database.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throttleTime } from 'rxjs';
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
    params?: HttpParams
  ) => {
    return this.http.get<T>(this.$url(url), { withCredentials: true, params: params });
  };
  private $post = <T = TypeInterfaceNet>(
    url: string,
    body?: {
      [key: string]: string|undefined,
    }
  ) => {
    let fd: FormData|undefined;
    if (body) {
      fd = new FormData();
      Object.keys(body).forEach(key => {
        if (body[key]) fd?.append(key, body[key]!);
      });
    }
    return this.http.post<T>(this.$url(url), fd, { withCredentials: true });
  };

  constructor(
    private http: HttpClient,
    private database: DatabaseService,
  ) {
  }

  /**
   * 获取首页数据
   **/
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
   * 获取nft列表
   **/
  getNefListByFilter$(params: {[key: string]: string}) {
    const queryParams = new HttpParams({ fromObject: params });
    return this.$get<TypeInterfaceNet>('v1/nft/list', queryParams)
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
   * v1/search_collection/{search}
   * search 搜索
   * 搜索合集
   * **/
   getSearchCollectionList$(search:string) {
    return this.$get<TypeInterfaceNet>(`v1/search_collection/${search}`);
  }
  /** 
   * v1/collection/{search}
   * search id
   * 合集详情
   * **/
   getCollectionDetail$(search:string) {
    return this.$get<TypeInterfaceNet>(`v1/collection/${search}`);
  }
  /** 
   * v1/nft/evevt
   * collectionID 合集id
   * nftID nft id
   * eventType 类型
   * addr 根据地址查询
   * 合集交易列表
   * **/
   getUserTrans$(collectionID:string,nftID:string,eventType:string,addr:string) {
    return this.$get<TypeInterfaceNet>(`v1/nft/event?collectionID=${collectionID}&nftID=${nftID}&eventType=${eventType}&addr=${addr}`);
  }
  /** 
   * v1/search_nft/{search}
   * search 搜索
   * 搜索nft
   * **/
   getSearchNftList$(search:string) {
    return this.$get<TypeInterfaceNet>(`v1/search_nft/${search}`);
  }
  
  /** 
   * v1/user/add_focus/{collection_id}
   * id 
   * 收藏合集
   * **/
   postAddFocus$(id:string) {
    return this.$post('v1/user/add_focus/'+id);
  }
  /** 
   * v1/user/del_collect/{collect_id}
   * id 
   * 删除收藏合集
   * **/
   postDelFocus$(id:string) {
    return this.$post('v1/user/del_focus/'+id);
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
   * collectionID 合集id
   * sort 排序(1最近转移,2最近上架,3最近创建，4最近卖出，5最近结束,6价格从低到高，7价格从高到低，8销售最高）
   * nft-列表(查询条件)
   * **/
   getNftList$(creator:string,category:string,sellingType:string,lowPrice:string|number,highPrice:string|number,coinType:string,collectionName:string,sort:string,collectionID:string) {
    return this.$get<TypeInterfaceNet>(`v1/nft/list?creator=${creator}&category=${category}&sellingType=${sellingType}&lowPrice=${lowPrice}&highPrice=${highPrice}&coinType=${coinType}&collectionName=${collectionName}&sort=${sort}&collectionID=${collectionID}`);
  }
  /**
   * 获取当前用户信息
   **/
  getNowUserInfo$() {
    return this.$get<TypeInterfaceNet>('v1/user/user_info').pipe(sub => {
      // 处理本地database
      const _sub = sub.subscribe(data => {
        const info = data.data.info;
        const asset = data.data.asset;
        let link = {};
        try {
          link = JSON.parse(info.Link);
        } catch (_) {}
        this.database.nowUserInfo = {
          avatar: info.Avator,
          name: info.Name,
          mainBg: info.Conver,
          describe: info.Description,
          link: link,
          balance: asset.balance.amount
        };
        _sub.unsubscribe();
      });
      return sub;
    });
  }

  /**
   * 上传图片
   **/
  postBaseImage$(input: string) {
    return this.$post('v1/upload_base64', { file: input }).pipe(sub => {
      const sub$ = new Subject<TypeInterfaceNet>();
      sub.subscribe(({data, ...other}) => {
        if (data && data.baseUrl && data.filePath) {
          sub$.next({
            ...other,
            data: data.baseUrl + data.filePath,
          });
        }
      });
      return sub$.pipe();
    });
  }

  /**
   * 更新当前用户信息
   **/
  putNowUserInfo$(obj: {[key: string]: string|undefined}) {
    return this.$post('v1/user/update_info', obj);
  }

  /**
   * 获取用户收藏列表
   **/
  getUserStarList$() {
    return this.$get('v1/user/collect_list');
  }

  /**
   * 获取用户关注售卖列表
   **/
  getUserStarSellList$() {
    return this.$get('v1/user/focus_list');
  }

}
