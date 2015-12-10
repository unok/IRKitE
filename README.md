# IRKitE (IRKit Electron Client)

## IRKit とは

IRKit は、ネットワーク経由で赤外線信号を送受信する装置です。
簡単に説明すると、主にリモコンで使われている赤外線の信号を受信して信号のデータを http 経由で取得したり、取得したデータを http 経由で送信することができます。また、ローカルでの http だけでなく、internet 経由での操作にも対応しています。
詳しい説明は、 http://getirkit.com/ こちらをご覧ください。

## 概要

アプリケーションから以下のことが可能です。

 * IRKit が受信した赤外線信号の取得
 * 取得済みの赤外線信号を IRKit から送信
 * 受信済みの赤外線信号の管理

## 詳細

今回のアプリは、次の技術を使っています。

  * フレームワーク
    * Electron
  * 言語
    * Typescript
  * ライブラリ
    * HTMLの動的操作
      * jQuery
    * 日時関係
      * mement.js
  * ブラウザ
    * localStorage
  * UI (HTML & CSS)
    * Photon http://photonkit.com/

## 使い方

  1. Setting にてローカルでアクセスできる IP アドレスを入力してください。
  1. Home へ移動する
  1. IRKit へリモコンの信号を送信する
  1. Home の Get Last Signal ボタンを押下
  1. 一覧に表示された一覧の send ボタンを押下
  1. 登録されたリモコンと同じ動作をするはず

## TODO

 * 登録信号の削除
 * HTML への双方向バインディング
 * インターネット経由の操作
 * 登録信号のエクスポート
 * 登録信号のインポート
 * 各種サービスへの連携
