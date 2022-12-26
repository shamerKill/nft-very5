import { DatabaseService } from './database.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, throttleTime, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

// 数据类型
export type TypeInterfaceNet<T=any> = {
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
  private $put = <T = TypeInterfaceNet>(
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
    return this.http.put<T>(this.$url(url), fd, { withCredentials: true });
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
   * 获取nft详情
   **/
  getNftInfoById$(id: string, address: string) {
    return this.$get('v1/nft/' + id, new HttpParams({fromObject: { address: address }}));
  }


  /**
   * 登录接口
   **/
  // 此处调用时this指向错误，需用箭头函数
  signLogin$ = (message: string, signStr: string) => {
    return this.$post('v1/auth/login', { signStr, message }).pipe(throttleTime(1000), sub => {
      const _sub = new Subject();
      sub.subscribe((data) => this.getNowUserInfo$().subscribe(() => _sub.next(data)));
      return _sub.pipe();
    });
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
   * owner 所有者
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
   getNftList$(creator:string,category:string,sellingType:string,lowPrice:string|number,highPrice:string|number,coinType:string,collectionName:string,sort:string,collectionID:string,owner:string='') {
    return this.$get<TypeInterfaceNet>(`v1/nft/list?creator=${creator}&category=${category}&sellingType=${sellingType}&lowPrice=${lowPrice}&highPrice=${highPrice}&coinType=${coinType}&collectionName=${collectionName}&sort=${sort}&collectionID=${collectionID}&owner=${owner}`);
  }
  /**
   * 获取用户信息
   **/
  getUserInfo$(address: string) {
    return this.$get<TypeInterfaceNet>(`v1/account/${address}`);
  }

  /**
   * 获取当前用户信息
   **/
  getNowUserInfo$() {
    const sub = this.$get<TypeInterfaceNet>('v1/user/user_info').pipe(
      map(
        // 处理本地database
        (data): TypeInterfaceNet => {
          if (!data.data) return data;
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
          return data;
        }
      ),
    );
    return sub;
  }

  /**
   * 上传图片
   **/
  postBaseImage$(input: string) {
    return this.$post('v1/upload_base64', { file: input }).pipe(
      map((res) => {
        const { data, ...other } = res;
        if (data && data.baseUrl && data.filePath) {
          return {
            ...other,
            data: data.baseUrl + data.filePath,
          };
        } else {
          return res;
        }
      }),
    );
  }

  /**
   * 更新当前用户信息
   **/
  putNowUserInfo$(obj: {[key: string]: string|undefined}) {
    return this.$post('v1/user/update_info', obj);
  }

  /**
   * 获取用户收藏nft列表
   **/
  getUserStarList$() {
    return this.$get('v1/user/collect_list');
  }

  /**
   * 获取用户关注合集列表
   **/
  getUserStarSellList$() {
    return this.$get('v1/user/focus_list');
  }

  /**
   * 搜索
   **/
  getSearchContent$(type: 'user'|'collection'|'nft', search: string) {
    let url = '';
    if (type === 'user') url = 'v1/search_account/';
    if (type === 'collection') url = 'v1/search_collection/';
    if (type === 'nft') url = 'v1/search_nft/';
    return this.$get(url + search);
  }

  /**
   * 关注收藏
   **/
  putAddStar$(type: 'collection'|'nft', id: string) {
    let url = '';
    if (type === 'collection') url = 'v1/user/add_focus/';
    if (type === 'nft') url = 'v1/user/add_collect/';
    return this.$post(url + id);
  }

  /**
   * 取消关注收藏
   **/
  putDelStar$(type: 'collection'|'nft', id: string) {
    let url = '';
    if (type === 'collection') url = 'v1/user/del_focus/';
    if (type === 'nft') url = 'v1/user/del_collect/';
    return this.$post(url + id);
  }

  /**
   * 创建新合集
   **/
  putNewCollection$(params: {
    [key in 'name'|'image'|'banner_image'|'external_link'|'creator_rate'|'fee_recipient'|'category'|'description'|'allow_token']: string
  }) {
    return this.$post('v1/my/collection', params);
  }
  /**
   * 修改合集
   **/
  postEditCollection$(params: {
    [key in 'id'|'name'|'image'|'banner_image'|'external_link'|'creator_rate'|'fee_recipient'|'category'|'description'|'allow_token']: string
  }) {
    return this.$put('v1/my/collection', params);
  }

  /**
   * 创建新nft
   **/
  putNewNFT$(params: {
    [key in 'name'|'image'|'external_link'|'description'|'attr'|'number'|'collection_id']: string
  }) {
    return this.$post('v1/my/nft', params);
  }

  /**
   * 修改nft
   **/
  postEditNFT$(params: {
    [key in 'id'|'name'|'image'|'external_link'|'description'|'attr']: string
  }) {
    return this.$put('v1/my/nft', params);
  }

  /**
   * 获取我的合集列表
   **/
  getMyCollectionList$() {
    return this.$get('v1/my/collection');
  }

  /**
   * 获取token列表
   **/
  getTokenList$(): Observable<TypeInterfaceNet<any>> {
    const tokenList = [
      { name: 'PC', minLen: 6, logo: '../../assets/images/logo/default-avatar.png', contract: '' },
      { name: 'PUSD', minLen: 6, logo: '../../assets/images/logo/default-avatar.png', contract: 'gx1gjxs8ygvlur2cekxajdnhkl4tkf2vl478w3ew0' },
    ];
    this.$get('v1/nft/tokens').subscribe(data => {
      console.log(data);
    });
    const sub = new BehaviorSubject<TypeInterfaceNet<any>>({
      code: 200,
      data: tokenList,
    });
    return sub.pipe();
  }

  /**
   * 获取所有可以支付代币
   **/
  getPayTokenList$(page: number = 1) {
    return this.$get('v1/nft/tokens', new HttpParams({fromObject: { page: page }}));
  }

  /**
   * 获取挂卖交易手续费
   **/
  getSellFee$(collectionId: string) {
    return this.$get('/v1/collection/basisPoints', new HttpParams({fromObject: {id: collectionId}}));
  }

  /**
   * nft挂卖
   **/
  postSellNft$(input: {
    id: string; // nft  ID
    type: number; // 1定价 2拍卖
    price: string; // 初始价格
    fixedBuyer: string; // 特定买家
    payContract: string; // 支付币合约
    payTokenName: string; // 支付币名称
    start: string; // 开始时间
    end: string; // 结束时间
    number: number; // 销售数量
  }) {
    return this.$post('v1/my/publish', {
      type: input.type.toString(),
      nft_id: input.id,
      start_price: input.price,
      assign_addr: input.fixedBuyer ? input.fixedBuyer : undefined,
      token: input.payContract,
      coin_type: input.payTokenName,
      start_date: input.start,
      stop_date: input.end,
      number: input.number.toString(),
    });
  }

  /**
   * nft挂卖签名提交
   **/
  postSellNftSign$(orderId: string, signed: string) {
    return this.$post('v1/my/addSign', {
      type: orderId,
      signature: signed,
    });
  }

  /**
   * 获取nft挂卖信息
   **/
  getNftSellingOrders$(id: string) {
    return this.$get('v1/order/orders/' + id);
  }

  /**
   * 获取nft的token_url元数据链接
   **/
  getNftSourceTokenUri$(id: string) {
    return this.$get('v1/nft/uri', new HttpParams({fromObject: { 'token_id': id }}));
  }
  /**
   * 获取nft购买一口价信息
   */
  getNftBuyOrderInfo$(id: string) {
    return this.$post('v1/my/buy', { orderID: id });
  }

  /**
   * nft竞拍
   */
  getNftOfferOrderInfo$(id: string, price:string, sign: string) {
    return this.$post('v1/my/offer', { orderID: id,price:price,sign });
  }

  /**
   * 获取交易信息
   */
  getTransferListHistory$(query?: {
    collectionID?: string; // 合集 ID
    nftID?: string; // nft id
    eventType?: ('create'|'successful'|'cancelled')[] // 创建成功取消
    addr?: string; // 操作地址
  }) {
    if (query?.eventType) {
      query.eventType = (query?.eventType.join(',') as any);
    }
    return this.$get('v1/nft/event', new HttpParams({fromObject: query}));
  }

  /**
   * 获取账户余额
   **/
  getAccountCoinBalance$(token: string) {
    return this.$get('v1/my/balance', new HttpParams({fromObject: {token}}));
  }

  /**
   * 获取买家报价
   **/
  getBuyerPriceOrder$(id: string) {
    return this.$get('v1/order/offers/' + id);
  }

  /**
   * 根据合集获取nft列表
   **/
  getNftListByCollectionId$(collectionId: string) {
    return this.$get('v1/nft/list', new HttpParams({fromObject: {collectionID: collectionId}}));
  }

  /**
   * 取消挂卖
   **/
  delSellOrder$(id: string) {
    return this.$post('v1/my/cancelOrder', { orderID: id })
  }

}

