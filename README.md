# DabadaMarket
![image](https://user-images.githubusercontent.com/82494320/222872893-9bf623fe-9f73-4333-ab06-83a4055a47e9.png)

## **직장 또는 그룹 내에서 온정을 주고 받는 마켓플레이스**

중고로 팔면 10만원인데 김대리님이 사신다면 8만원만 받을게요!
심지어는 그냥 드립니다. 술이나 한잔 사세요!
친구, 친척, 아는 지인들에게는 더 싸게 파는 성향을 반영하여 같은 직장, 같은 건물 등 소규모 집단내에서 손쉽게 판매할 수 있는 플랫폼

## **Installation**

<pre>
> git clone https://github.com/hwantage/DabadaMarket.git

> npm run build
> npx react-native run-android
</pre>

* 사전 준비 사항
  - Nodejs 설치
  - Python 설치
  - React Native CLI 설치
  - JDK 설치
  - 안드로이드 스튜디오 설치

## Mockup

[Figma link](https://www.figma.com/proto/FEEZUb52YHnrF7vqbw9zF0/dabada?node-id=113%3A1490&scaling=scale-down&page-id=0%3A1&starting-point-node-id=113%3A1490&show-proto-sidebar=1)


## Firestore database naming convention

* Collection : c**amelCase**

* Document : **snake_case** 

* Field Key : 약어 Prefix 사용

    - `u` : User, `p` : Product, `pi` : ProductImg, `c` : chat, `cm` : ChatMessage, `k` : Keyword, `n` : Notification, `r` : Review

    - 약어 이후 언더바( _ ) 로 연결하고 최대 언더바 2개까지 사용. 예) p_buyer_id


## Project naming and Directory structure define

### ProjectName : **DabadaMarket**

### Directory Structure (디렉토리는 전부 소문자로 생성)

- **assets (camelCase)**
    - defaultAvatar.jpg
- **components (PascalCase)**
    - common
        - DabadaButton.tsx
        - DabadaInput.tsx
        - DabadaText.tsx
        - Avatar.tsx
    - product
        - List.tsx
        - Item.tsx
    - user
        - Sell.tsx
        - Keyword.tsx
- **hooks (use 프리픽스, camelCase)**
    - useProduct.tsx
- **recoil (Atom 포스트픽스, camelCase)**
    - userAtom.tsx
    - userSelector.tsx
- **screens (PascalCase)**
    - AppStack.tsx
    - AppStackProduct.tsx
    - AppStackNotification.tsx
    - BottomTab.tsx
    - ProductListScreen.tsx
    - MyProfileModifyScreen.tsx
- **lang (camelCase)**
    - en.json
    - ko.json
    - i18n.tsx
- **utils (camelCase)**
    - auth.jsx
    - products.jsx
- App.tsx
- index.js

## Dabada Market 소개 PPT

[Canva link](https://www.canva.com/design/DAFbGp9J41g/nnRT9pUTwE3PzGytZBSoQA/view?utm_content=DAFbGp9J41g&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## 앱 스택 네비게이션 구조

![image](https://user-images.githubusercontent.com/82494320/221725076-025362ac-aafd-40a3-a1e6-a4e1c74cf916.png)
