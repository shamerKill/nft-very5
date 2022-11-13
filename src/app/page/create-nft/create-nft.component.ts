import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-nft',
  templateUrl: './create-nft.component.html',
  styleUrls: ['./create-nft.component.scss']
})
export class CreateNftComponent implements OnInit {

  // 属性列表
  attributeList: {[key: string]: string}[] = [
    {}
  ];

  // 选择份数
  selectedNum: string = 'one';

  // 合集列表
  collectionList: {
    id: string;
    image: string;
    name: string;
  }[] = [
    {
      id: '1',
      image: '../../../assets/images/cache/home/矩形 12 拷贝 3.png',
      name: 'Wolf Game - Game Land N...Wolf Game - Game Land N...'
    },
    {
      id: '2',
      image: '../../../assets/images/cache/home/矩形 12 拷贝 3.png',
      name: 'Wolf Game - Game Land N...Wolf Game - Game Land N...'
    }
  ];

  // 选择的合集
  selectedCollection: string = '1';

  constructor() { }

  ngOnInit(): void {
  }

  // 添加属性列表
  addAttribute() {
    this.attributeList.push({});
  }
  // 删除属性列表
  delAttribute(index: number) {
    let arr = [];
    for (let i = 0; i < this.attributeList.length; i++) {
      if (i !== index) arr.push(this.attributeList[i]);
    }
    this.attributeList = arr;
  }
  // 选择合集
  changeCollection(id: string) {
    this.selectedCollection = id;
  }

}
