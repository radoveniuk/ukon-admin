import { Post } from '@prisma/client';



type Props = {
  data: Post;
};

export default function PostPreview(props: Props) {
  const postWithLayout = `
  <!DOCTYPE html>
<!-- saved from url=(0023)https://ukon.sk/cookies -->
<html lang="sk">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width">
  <title>Cookies | Úkon.sk</title>
  <meta name="robots" content="index,follow">
  <meta name="description" content="Cookies">
  <meta property="og:title" content="Cookies | Úkon.sk">
  <meta property="og:description" content="Cookies">
  <meta name="next-head-count" content="8">
  <link rel="preconnect" href="https://fonts.googleapis.com/">
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="true">
  <meta name="google-site-verification" content="vg10DPpVBEaK8KoeCSh5jR5S1qYR5HTa6nI3bJTzh84">
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="">
  <link rel="preload" href="https://ukon.sk/_next/static/css/09c7394aedd3c62e.css" as="style"><noscript
    data-n-css=""></noscript>
  <style data-n-href="/_next/static/css/bd0a3c0ec1b4f146.css">
    .Footer_logo__viwIH {
      display: flex;
      gap: 20px;
      flex-direction: column;
      justify-content: space-between
    }

    .Footer_footer__WO_jN {
      background-color: #99c3bd;
      padding: 40px 0 50px;
      white-space: nowrap
    }

    @media(max-width:1399px) {
      .Footer_footer__WO_jN {
        padding: 50px 0
      }
    }

    @media(max-width:1249px) {
      .Footer_footer__WO_jN {
        padding: 50px 0 90px
      }
    }

    .Footer_footer__top__tshks {
      justify-content: space-between;
      display: flex;
      flex-wrap: wrap;
      gap: 35px
    }

    @media(max-width:1249px) {
      .Footer_footer__top__tshks {
        flex-direction: column
      }
    }

    .Footer_footer__logo__6zIQB {
      display: flex
    }

    @media(max-width:999px) {
      .Footer_footer__logo__6zIQB svg {
        width: 117px;
        height: 37px
      }
    }

    .Footer_footer__right___m_K7 {
      display: flex;
      gap: 45px;
      justify-content: flex-start;
      align-content: center;
      flex-wrap: wrap
    }

    @media(max-width:999px) {
      .Footer_footer__right___m_K7 {
        align-content: flex-start;
        gap: 35px
      }
    }

    .Footer_footer__menu__X6T7_ {
      display: flex;
      gap: 45px;
      justify-content: space-between;
      flex-wrap: wrap
    }

    .Footer_footer__menu__col__2EHIN {
      display: flex;
      flex-direction: column;
      gap: 15px;
      justify-content: space-between
    }

    @media(max-width:999px) {
      .Footer_footer__menu__X6T7_ {
        width: 75%
      }
    }

    @media(max-width:480px) {
      .Footer_footer__menu__X6T7_ {
        flex-direction: column;
        gap: 25px;
        width: 100%
      }
    }

    .Footer_footer__link__yg7xg:hover a {
      text-decoration: underline;
      color: #10826e
    }

    .Footer_footer__link__yg7xg a {
      transition-duration: .4s;
      color: #131313
    }

    .Footer_footer__contacts__q_vwE {
      display: flex;
      flex-direction: column;
      gap: 15px;
      justify-content: space-between
    }

    .Footer_footer__contacts__q_vwE a {
      transition-duration: .4s;
      color: #131313
    }

    .Footer_footer__contacts__q_vwE a:hover {
      text-decoration: underline;
      color: #10826e
    }

    .Footer_footer__socialGroup__OyBq9 {
      display: flex;
      gap: 10px;
      flex-direction: column;
      align-items: flex-end
    }

    @media(max-width:759px) {
      .Footer_footer__socialGroup__OyBq9 {
        align-items: center
      }
    }

    .Footer_footer__socials__fsGAJ {
      display: flex;
      gap: 10px
    }

    .Footer_footer__social__aSU18 {
      display: flex;
      border: 2px solid #131313;
      border-radius: 50px;
      width: 46px;
      height: 46px;
      align-items: center;
      justify-content: center
    }

    .Footer_footer__social__aSU18:hover {
      border: 2px solid #10826e
    }

    .Footer_footer__social__aSU18:hover path {
      fill: #10826e
    }

    .Footer_footer__social__aSU18 svg path {
      transition-duration: .4s
    }

    .Footer_footer__complain__jja8n {
      font-size: 16px;
      font-weight: 400;
      white-space: nowrap;
      cursor: pointer;
      padding: 11px 20px;
      border-radius: 50px;
      border: 2px solid #131313;
      transition-duration: .4s;
      max-width: min-content;
      background: #99c3bd;
      max-height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none
    }

    .Footer_footer__complain__jja8n span {
      color: #131313
    }

    @media(max-width:375px) {
      .Footer_footer__complain__jja8n {
        padding: 7px 15px
      }
    }

    .Footer_footer__complain__jja8n:hover {
      border: 2px solid #10826e
    }

    .Footer_footer__complain__jja8n:hover span {
      color: #10826e
    }

    .Footer_footer__complain__jja8n:hover path {
      fill: #10826e
    }

    .Footer_footer__complain__jja8n svg path {
      transition-duration: .4s
    }

    .Position_position__9jQOE {
      margin: 30px 0 40px;
      position: relative;
      z-index: 10
    }

    @media(max-width:1549px) {
      .Position_position__9jQOE {
        margin: 20px 0 30px
      }
    }

    @media(max-width:999px) {
      .Position_position__9jQOE {
        margin: 20px 0
      }
    }

    @media(max-width:759px) {
      .Position_position__9jQOE {
        margin-bottom: 10px
      }
    }

    .Position_position__9jQOE .Position_container__v4u3H {
      flex-direction: row;
      align-items: center
    }

    .Position_position__link__gmqIP {
      display: flex;
      align-items: center
    }

    .Position_position__link__gmqIP:last-child a {
      color: #a1a1a1;
      pointer-events: none
    }

    .Position_position__link__gmqIP:last-child span {
      display: none
    }

    .Position_position__link__gmqIP a {
      color: #131313;
      transition-duration: .4s
    }

    .Position_position__link__gmqIP a:hover {
      color: #44998a
    }

    .Position_position__link__gmqIP span {
      color: #a1a1a1;
      margin: 0 10px
    }
  </style>
  <style
    data-href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap">
    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9aXw.woff) format('woff')
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew9.woff) format('woff')
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew9.woff) format('woff')
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCu170w9.woff) format('woff')
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXV0oJC8MLnbtrVK.woff) format('woff');
      unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXx0oJC8MLnbtrVK.woff) format('woff');
      unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXd0oJC8MLnbtrVK.woff) format('woff');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXZ0oJC8MLnbtrVK.woff) format('woff');
      unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R9WXh0oJC8MLnbtg.woff) format('woff');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WRhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WZhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WdhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WRhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WZhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WdhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WRhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WZhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WdhyyTh89ZNpQ.woff2) format('woff2');
      unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF
    }

    @font-face {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
    }
  </style>
</head>
<body>
  <div id="__next">
    <header class="Header_header__Q_ybM">
      <div class="container Header_content__EK2X4">
        <div class="Header_left__xzRxY"><a aria-label="Úvod" href="https://ukon.sk/"><svg class="Header_logo__efqR6"
              width="150" height="47" viewBox="0 0 150 47" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_1173_3135)">
                <path
                  d="M21.4419 0.306198C19.1609 0.900451 9.96383 4.33991 9.50762 4.75409C8.99667 5.25831 8.75945 6.21271 8.99667 6.897C9.17915 7.41922 10.274 8.10352 10.9492 8.10352C11.5697 8.10352 22.993 5.60045 23.5222 5.34834C25.2558 4.51999 25.2375 1.40467 23.4857 0.576313C22.9018 0.28819 21.9529 0.162137 21.4419 0.306198Z"
                  fill="#131313"></path>
                <path
                  d="M43.0112 12.3347C41.9528 12.7309 41.2776 13.2891 40.8761 14.0634C40.5112 14.7477 40.5112 15.0899 40.5477 29.6941C40.6024 44.5324 40.6024 44.6405 40.9856 45.1447C41.1863 45.4148 41.7155 45.883 42.1352 46.1891C42.7557 46.6213 43.1206 46.7293 44.1608 46.7834C46.2046 46.9094 47.6462 46.2071 48.3396 44.7665C48.6863 44.0642 48.7228 43.668 48.7228 40.1385C48.7228 38.0136 48.7958 36.0148 48.9053 35.6726C49.1243 34.8803 49.8542 33.8359 50.5294 33.3496L51.0404 32.9715L56.4053 38.95C59.3433 42.2454 62.044 45.1987 62.409 45.5408C64.0878 47.1615 66.4601 47.2516 68.3944 45.7929C69.5623 44.9106 70.0367 43.0738 69.4345 41.6692C69.2885 41.291 67.0623 38.86 64.0878 35.7807C61.2958 32.8814 58.4674 29.9462 57.7922 29.2439L56.5696 27.9473L59.617 25.1922C61.3141 23.6795 63.5951 21.6267 64.69 20.6182C65.8031 19.5918 66.971 18.5473 67.2995 18.2772C68.6681 17.1428 68.9966 15.432 68.0842 14.0094C67.409 12.965 65.7119 12.0646 64.4345 12.0646C62.7739 12.0646 62.0623 12.5868 57.0805 17.4129C50.4747 23.8236 49.9272 24.3098 49.4893 24.3098C49.2703 24.3098 49.0148 24.1477 48.9053 23.9677C48.7958 23.7516 48.7228 21.9148 48.7228 19.2677C48.7228 14.6037 48.6681 14.2435 47.7374 13.2891C47.4637 13.019 46.9893 12.6588 46.6608 12.4968C45.8761 12.0826 43.8871 11.9926 43.0112 12.3347Z"
                  fill="#131313"></path>
                <path
                  d="M2.28126 12.9473C1.3871 13.3434 0.620678 14.1898 0.365204 15.0902C0.219218 15.5584 0.182722 18.7637 0.219218 25.4806C0.292211 33.8902 0.346955 35.3668 0.60243 36.3392C2.09878 41.8856 6.82506 45.7212 13.3032 46.6396C15.347 46.9457 18.9966 46.7656 20.8397 46.2974C22.6097 45.8473 24.7083 44.9829 25.8579 44.2446C27.4637 43.2181 29.5805 40.9312 30.4382 39.3105C31.9893 36.3572 31.9893 36.3212 32.0805 25.4086C32.1535 14.9101 32.1535 14.9281 31.1134 13.8116C29.6353 12.245 26.9528 12.1729 25.4382 13.6496C24.3251 14.766 24.3616 14.3338 24.2703 24.9404C24.1426 36.2492 24.2338 35.7269 22.3725 37.5637C20.8397 39.0764 19.3981 39.6346 16.8068 39.7607C13.7229 39.9047 11.3689 39.1304 9.76301 37.4377C7.95644 35.5289 7.84696 34.7185 7.84696 23.8599C7.84696 14.604 7.8652 14.802 6.86155 13.7216C5.8579 12.6231 3.77761 12.263 2.28126 12.9473Z"
                  fill="#131313"></path>
                <path
                  d="M88.504 12.9466C83.0296 14.1171 78.796 17.3765 76.4967 22.1486C75.4201 24.3995 75.1646 25.606 75.0551 28.8114C74.9091 32.9532 75.5478 35.5283 77.4821 38.8057C78.577 40.6424 81.1683 43.2175 83.0113 44.298C86.15 46.1528 89.38 46.9091 93.3398 46.765C97.1719 46.621 99.9456 45.7566 102.938 43.7578C106.059 41.6689 108.687 37.8873 109.672 34.1237C110.165 32.2689 110.347 28.6493 110.055 26.6865C109.106 20.2398 104.216 14.9455 97.5369 13.1267C95.4383 12.5685 90.7121 12.4604 88.504 12.9466ZM95.8946 20.0237C98.8508 20.852 100.986 22.8869 101.935 25.8041C102.336 27.0466 102.427 27.6229 102.427 29.3516C102.446 30.7562 102.336 31.8007 102.135 32.593C101.187 36.1405 98.7595 38.6616 95.4201 39.526C94.1062 39.8681 91.0588 39.8681 89.6902 39.526C87.2449 38.8957 85.0916 37.167 83.942 34.916C83.1208 33.3493 82.8654 32.2869 82.7376 30.162C82.4456 25.2279 84.8909 21.3202 89.1062 19.9876C90.9675 19.4114 93.7778 19.4114 95.8946 20.0237Z"
                  fill="#131313"></path>
                <path
                  d="M130.018 12.8571C126.04 13.6134 123.321 14.982 121.04 17.341C118.777 19.7 117.719 21.9689 117.354 25.2463C117.245 26.2368 117.153 30.5946 117.153 35.2586C117.153 44.2804 117.172 44.5325 118.212 45.631C119.891 47.3958 123.139 47.1977 124.544 45.2168L125.091 44.4425L125.183 34.8804C125.274 26.5789 125.329 25.1743 125.602 24.4C126.588 21.4467 129.088 19.862 133.011 19.664C135.219 19.5559 136.46 19.79 138.12 20.6004C140.183 21.5908 141.387 23.1214 141.788 25.2463C141.898 25.7505 141.971 30.0904 141.971 34.9705C141.971 44.5686 141.971 44.5145 143.029 45.613C143.923 46.5494 144.799 46.8555 146.241 46.7835C147.993 46.6935 148.942 46.1172 149.562 44.7486L150.018 43.7582L149.964 34.0881C149.891 24.7961 149.872 24.346 149.489 22.9954C148.12 18.1333 144.288 14.6398 138.777 13.2172C137.263 12.821 136.46 12.731 134.124 12.677C132.263 12.641 130.858 12.695 130.018 12.8571Z"
                  fill="#131313"></path>
              </g>
              <defs>
                <clippath id="clip0_1173_3135">
                  <rect width="150" height="47" fill="white"></rect>
                </clippath>
              </defs>
            </svg></a>
          <div class="Header_langs__3WUz0">
            <div class="Header_link__CHMJB false">
              <div class="Header_top__4m4OJ"><span>sk</span><svg stroke="currentColor" fill="currentColor"
                  stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z">
                  </path>
                </svg></div>
              <div class="Header_bot__TKbf9">
                <div class="Header_links__y66PU"><a class="Header_link__CHMJB"
                    href="https://ukon.sk/uk/cookies">uk</a><a class="Header_link__CHMJB"
                    href="https://ukon.sk/ru/cookies">ru</a></div>
              </div>
            </div>
          </div>
        </div>
        <div class="Header_right__KWEQA Header_extended__KfoN7">
          <ul class="Header_menu__W8r8e">
            <li class="Header_link__CHMJB false">
              <div class="Header_top__4m4OJ"><span>Služby</span><svg stroke="currentColor" fill="currentColor"
                  stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z">
                  </path>
                </svg></div>
              <div class="Header_bot__TKbf9">
                <div class="Header_links__y66PU"><a class="Header_link__CHMJB false"
                    href="https://ukon.sk/sluzby/zalozenie-zivnosti">Založenie živnosti</a><a
                    class="Header_link__CHMJB false" href="https://ukon.sk/sluzby/zmena-zivnosti">Zmeny v živnosti</a><a
                    class="Header_link__CHMJB false" href="https://ukon.sk/sluzby/virtualne-sidlo">Virtuálne sídlo</a>
                </div>
              </div>
            </li>
            <li class="Header_link__CHMJB false">
              <div class="Header_top__4m4OJ"><a href="https://ukon.sk/cennik-sluzieb">Cenník</a></div>
            </li>
            <li class="Header_link__CHMJB false">
              <div class="Header_top__4m4OJ"><a href="https://ukon.sk/kontakty">Kontakt</a></div>
            </li>
          </ul><a aria-label="Profil" class="Header_profile__VB_Dh" href="https://ukon.sk/account"><svg
              stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" color="#44998A"
              style="color:#44998A" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z">
              </path>
            </svg></a>
          <div class="opener"><div class="Button_btn__gZGom Header_button__YmDZn">Objednávka</div></div>
        </div>
        <div class="Header_rightMob__UsLuZ"><a aria-label="Profil" class="Header_profile__VB_Dh"
            href="https://ukon.sk/account"><svg stroke="currentColor" fill="currentColor" stroke-width="0"
              viewBox="0 0 448 512" color="#44998A" style="color:#44998A" height="1em" width="1em"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z">
              </path>
            </svg></a>
          <div class="Header_burger__M4fnn"><svg stroke="currentColor" fill="currentColor" stroke-width="0"
              viewBox="0 0 512 512" color="#717171" style="color:#717171" height="20" width="20"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z"></path>
            </svg><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
              color="#717171">
              <path d="M3.34315 15.1568L14.6569 3.84314" stroke="#717171" stroke-width="1.5" stroke-linecap="round">
              </path>
              <path d="M3.34315 3.84315L14.6569 15.1569" stroke="#717171" stroke-width="1.5" stroke-linecap="round">
              </path>
            </svg></div>
        </div>
      </div>
    </header>
    <div class="Header_mob__z6SBj">
      <div class="Header_links__y66PU">
        <div class="Header_link__CHMJB">
          <div role="button"><span class="Header_top__4m4OJ Header_open__GNIho">Služby<svg stroke="currentColor"
                fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z">
                </path>
              </svg></span></div>
          <div class="Header_bot__TKbf9 Header_open__GNIho"><a>Založenie živnosti</a><a>Zmeny v živnosti</a><a>Virtuálne sídlo</a></div>
        </div>
        <div class="Header_link__CHMJB"><a class="Header_top__4m4OJ">Cenník</a>
        </div>
        <div class="Header_link__CHMJB"><a class="Header_top__4m4OJ">Kontakt</a></div>
      </div>
      <div class="opener"><button class="Button_btn__gZGom Header_btn__w0x_9">Objednávka</button></div><a class="Header_btn__w0x_9 Header_phone__M5HCy">+421 908 503 257</a>
    </div>
    <style type="text/css">
      .article__top {
        padding: 40px 0;
        background-color: #FAFAFA;
        margin-bottom: 40px;
        text-align: center;

        @media (max-width: 999px) {
          margin-bottom: 10px;
          padding: 25px 0;
        }
      }

      .article-date {
        color: #717171;
      }

      .article-title {
        color: #131313;
        margin: 10px 0;
        text-align: center;
      }

      .article-subtitle {
        color: #717171;
      }

      .article__cont h4 {
        margin: 40px 0 20px 0;

        @media (max-width: 999px) {
          margin: 20px 0 10px 0
        }
      }

      .article__cont h5 {
        margin: 20px 0 10px 0;
      }

      p {
        margin-bottom: 15px;
      }

      .article__cont {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 810px;
        margin: 0 auto;

        @media (max-width: 1549px) {
          max-width: 824px;
        }

        @media (max-width: 999px) {
          max-width: 100%;
        }
      }

      .article__cont ol li {
        list-style-type: decimal;
        margin-bottom: 15px;
        margin-left: 30px;

        @media (max-width: 999px) {
          margin-left: 20px;
          margin-bottom: 10px;
        }
      }

      .article__cont ul li {
        list-style-type: disc;
        margin-bottom: 0px;
        margin-left: 30px;

        @media (max-width: 999px) {
          margin-left: 18px;
        }
      }

      .article__cont li {
        font-style: normal;
        font-weight: 400;
        font-size: 18px;
        line-height: 150%;
        color: #131313;

        @media (max-width: 1899px) {
          font-size: 18px;
        }

        @media (max-width: 1549px) {
          font-size: 18px;
        }

        @media (max-width: 1399px) {
          font-size: 16px;
        }

        @media (max-width: 1249px) {
          font-size: 16px;
        }

        @media (max-width: 375px) {
          font-size: 14px;
        }
        .article__cont a {
          color: #44998a;
        }

        .article__cont a:hover {
          text-decoration: underline
        }
    </style>
    <main>
      <section class="Position_position__9jQOE">
        <div class="Position_container__v4u3H container">
          <div class="Position_position__link__gmqIP"><a class="t5">Úvod</a><span
              class="t5">|</span></div>
          <div class="Position_position__link__gmqIP"><a class="t5">Blog</a><span
              class="t5">|</span></div>
          <div class="Position_position__link__gmqIP"><a class="t5">${props.data.name}</a><span
              class="t5">|</span></div>
        </div>
      </section>
      <section class="mb">
        <div class="article__top">
          <div class="container">
            <div class="article-date t4">${props.data.publicationDate || ''}</div>
            <h2 class="article-title h2">${props.data.name || ''}</h2>
            <div class="article-subtitle h4">Úkon.sk s.r.o.</div>
          </div>
        </div>
        <div class="container">
          <div class="article__cont">
          ${props.data.content || ''}
          </div>
        </div>
      </section>
    </main>
    <footer class="Footer_footer__WO_jN">
      <div class="container">
        <div class="Footer_footer__top__tshks">
          <div class="Footer_logo__viwIH"><a aria-label="Úvod" class="Footer_footer__logo__6zIQB">
            <svg width="150" height="47" viewBox="0 0 150 47" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1173_3135)">
                  <path
                    d="M21.4419 0.306198C19.1609 0.900451 9.96383 4.33991 9.50762 4.75409C8.99667 5.25831 8.75945 6.21271 8.99667 6.897C9.17915 7.41922 10.274 8.10352 10.9492 8.10352C11.5697 8.10352 22.993 5.60045 23.5222 5.34834C25.2558 4.51999 25.2375 1.40467 23.4857 0.576313C22.9018 0.28819 21.9529 0.162137 21.4419 0.306198Z"
                    fill="#131313"></path>
                  <path
                    d="M43.0112 12.3347C41.9528 12.7309 41.2776 13.2891 40.8761 14.0634C40.5112 14.7477 40.5112 15.0899 40.5477 29.6941C40.6024 44.5324 40.6024 44.6405 40.9856 45.1447C41.1863 45.4148 41.7155 45.883 42.1352 46.1891C42.7557 46.6213 43.1206 46.7293 44.1608 46.7834C46.2046 46.9094 47.6462 46.2071 48.3396 44.7665C48.6863 44.0642 48.7228 43.668 48.7228 40.1385C48.7228 38.0136 48.7958 36.0148 48.9053 35.6726C49.1243 34.8803 49.8542 33.8359 50.5294 33.3496L51.0404 32.9715L56.4053 38.95C59.3433 42.2454 62.044 45.1987 62.409 45.5408C64.0878 47.1615 66.4601 47.2516 68.3944 45.7929C69.5623 44.9106 70.0367 43.0738 69.4345 41.6692C69.2885 41.291 67.0623 38.86 64.0878 35.7807C61.2958 32.8814 58.4674 29.9462 57.7922 29.2439L56.5696 27.9473L59.617 25.1922C61.3141 23.6795 63.5951 21.6267 64.69 20.6182C65.8031 19.5918 66.971 18.5473 67.2995 18.2772C68.6681 17.1428 68.9966 15.432 68.0842 14.0094C67.409 12.965 65.7119 12.0646 64.4345 12.0646C62.7739 12.0646 62.0623 12.5868 57.0805 17.4129C50.4747 23.8236 49.9272 24.3098 49.4893 24.3098C49.2703 24.3098 49.0148 24.1477 48.9053 23.9677C48.7958 23.7516 48.7228 21.9148 48.7228 19.2677C48.7228 14.6037 48.6681 14.2435 47.7374 13.2891C47.4637 13.019 46.9893 12.6588 46.6608 12.4968C45.8761 12.0826 43.8871 11.9926 43.0112 12.3347Z"
                    fill="#131313"></path>
                  <path
                    d="M2.28126 12.9473C1.3871 13.3434 0.620678 14.1898 0.365204 15.0902C0.219218 15.5584 0.182722 18.7637 0.219218 25.4806C0.292211 33.8902 0.346955 35.3668 0.60243 36.3392C2.09878 41.8856 6.82506 45.7212 13.3032 46.6396C15.347 46.9457 18.9966 46.7656 20.8397 46.2974C22.6097 45.8473 24.7083 44.9829 25.8579 44.2446C27.4637 43.2181 29.5805 40.9312 30.4382 39.3105C31.9893 36.3572 31.9893 36.3212 32.0805 25.4086C32.1535 14.9101 32.1535 14.9281 31.1134 13.8116C29.6353 12.245 26.9528 12.1729 25.4382 13.6496C24.3251 14.766 24.3616 14.3338 24.2703 24.9404C24.1426 36.2492 24.2338 35.7269 22.3725 37.5637C20.8397 39.0764 19.3981 39.6346 16.8068 39.7607C13.7229 39.9047 11.3689 39.1304 9.76301 37.4377C7.95644 35.5289 7.84696 34.7185 7.84696 23.8599C7.84696 14.604 7.8652 14.802 6.86155 13.7216C5.8579 12.6231 3.77761 12.263 2.28126 12.9473Z"
                    fill="#131313"></path>
                  <path
                    d="M88.504 12.9466C83.0296 14.1171 78.796 17.3765 76.4967 22.1486C75.4201 24.3995 75.1646 25.606 75.0551 28.8114C74.9091 32.9532 75.5478 35.5283 77.4821 38.8057C78.577 40.6424 81.1683 43.2175 83.0113 44.298C86.15 46.1528 89.38 46.9091 93.3398 46.765C97.1719 46.621 99.9456 45.7566 102.938 43.7578C106.059 41.6689 108.687 37.8873 109.672 34.1237C110.165 32.2689 110.347 28.6493 110.055 26.6865C109.106 20.2398 104.216 14.9455 97.5369 13.1267C95.4383 12.5685 90.7121 12.4604 88.504 12.9466ZM95.8946 20.0237C98.8508 20.852 100.986 22.8869 101.935 25.8041C102.336 27.0466 102.427 27.6229 102.427 29.3516C102.446 30.7562 102.336 31.8007 102.135 32.593C101.187 36.1405 98.7595 38.6616 95.4201 39.526C94.1062 39.8681 91.0588 39.8681 89.6902 39.526C87.2449 38.8957 85.0916 37.167 83.942 34.916C83.1208 33.3493 82.8654 32.2869 82.7376 30.162C82.4456 25.2279 84.8909 21.3202 89.1062 19.9876C90.9675 19.4114 93.7778 19.4114 95.8946 20.0237Z"
                    fill="#131313"></path>
                  <path
                    d="M130.018 12.8571C126.04 13.6134 123.321 14.982 121.04 17.341C118.777 19.7 117.719 21.9689 117.354 25.2463C117.245 26.2368 117.153 30.5946 117.153 35.2586C117.153 44.2804 117.172 44.5325 118.212 45.631C119.891 47.3958 123.139 47.1977 124.544 45.2168L125.091 44.4425L125.183 34.8804C125.274 26.5789 125.329 25.1743 125.602 24.4C126.588 21.4467 129.088 19.862 133.011 19.664C135.219 19.5559 136.46 19.79 138.12 20.6004C140.183 21.5908 141.387 23.1214 141.788 25.2463C141.898 25.7505 141.971 30.0904 141.971 34.9705C141.971 44.5686 141.971 44.5145 143.029 45.613C143.923 46.5494 144.799 46.8555 146.241 46.7835C147.993 46.6935 148.942 46.1172 149.562 44.7486L150.018 43.7582L149.964 34.0881C149.891 24.7961 149.872 24.346 149.489 22.9954C148.12 18.1333 144.288 14.6398 138.777 13.2172C137.263 12.821 136.46 12.731 134.124 12.677C132.263 12.641 130.858 12.695 130.018 12.8571Z"
                    fill="#131313"></path>
                </g>
                <defs>
                  <clippath id="clip0_1173_3135">
                    <rect width="150" height="47" fill="white"></rect>
                  </clippath>
                </defs>
              </svg></a>
            <div class="t4">Copyright © 2023 | Úkon.sk s.r.o.</div>
          </div>
          <div class="Footer_footer__right___m_K7">
            <div class="Footer_footer__menu__X6T7_">
              <ul class="Footer_footer__menu__col__2EHIN">
                <li class="Footer_footer__link__yg7xg"><a class="t1"
                    >Založenie živnosti</a></li>
                <li class="Footer_footer__link__yg7xg"><a class="t1"
                    >Virtuálne sídlo</a></li>
                <li class="Footer_footer__link__yg7xg"><a class="t1">Zmeny
                    v živnosti</a></li>
              </ul>
              <ul class="Footer_footer__menu__col__2EHIN">
                <li class="Footer_footer__link__yg7xg"><a class="t1">Všeobecné obchodné
                    podmienky</a></li>
                <li class="Footer_footer__link__yg7xg"><a class="t1">Spracovanie
                    osobných údajov</a></li>
                <li class="Footer_footer__link__yg7xg"><a class="t1">Cookies</a></li>
              </ul>
            </div>
            <div class="Footer_footer__menu__X6T7_">
              <div class="Footer_footer__contacts__q_vwE"><a class="t1">Kontakt</a><a
                  href="tel:+421 908 503 257" class="t2">+421 908 503 257</a><a href="mailto:info@ukon.sk"
                  class="t2">info@ukon.sk</a></div>
              <div class="Footer_footer__socialGroup__OyBq9"><a
                  aria-label="GoogleForm" target="_blank" rel="noreferrer" class="Footer_footer__complain__jja8n"><svg
                    width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.875 4.12683C19.875 3.67337 19.6008 3.26208 19.1789 3.08632C18.757 2.91056 18.2754 3.00899 17.952 3.32887L16.4191 4.86504C14.7316 6.55235 12.443 7.50147 10.0559 7.50147H9.75H8.625H5.25C4.00898 7.50147 3 8.51034 3 9.75122V13.1259C3 14.3667 4.00898 15.3756 5.25 15.3756V19.8751C5.25 20.4973 5.75273 21 6.375 21H8.625C9.24727 21 9.75 20.4973 9.75 19.8751V15.3756H10.0559C12.443 15.3756 14.7316 16.3247 16.4191 18.012L17.952 19.5447C18.2754 19.8681 18.757 19.963 19.1789 19.7872C19.6008 19.6115 19.875 19.2037 19.875 18.7467V13.5617C20.5289 13.2524 21 12.4193 21 11.4385C21 10.4578 20.5289 9.62467 19.875 9.31533V4.12683ZM17.625 6.82303V11.4385V16.0541C15.5578 14.1734 12.8613 13.1259 10.0559 13.1259H9.75V9.75122H10.0559C12.8613 9.75122 15.5578 8.70368 17.625 6.82303Z"
                      fill="#131313"></path>
                  </svg><span class="t2">Podať sťažnosť riaditeľovi</span></a>
                <div class="Footer_footer__socials__fsGAJ"><a
                     aria-label="Instagram" target="_blank"
                    rel="noreferrer" class="Footer_footer__social__aSU18"><svg width="24" height="24"
                      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15.9997 6.99956C15.9997 6.44727 16.4474 5.99956 16.9997 5.99956C17.552 5.99956 17.9997 6.44727 17.9997 6.99956C17.9997 7.55184 17.552 7.99956 16.9997 7.99956C16.4474 7.99956 15.9997 7.55184 15.9997 6.99956Z"
                        fill="black"></path>
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M11.9997 7.24956C9.37634 7.24956 7.24969 9.3762 7.24969 11.9996C7.24969 14.6229 9.37634 16.7496 11.9997 16.7496C14.623 16.7496 16.7497 14.6229 16.7497 11.9996C16.7497 9.3762 14.623 7.24956 11.9997 7.24956ZM8.74969 11.9996C8.74969 10.2046 10.2048 8.74956 11.9997 8.74956C13.7946 8.74956 15.2497 10.2046 15.2497 11.9996C15.2497 13.7945 13.7946 15.2496 11.9997 15.2496C10.2048 15.2496 8.74969 13.7945 8.74969 11.9996Z"
                        fill="black"></path>
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M17.2579 2.83257C13.7914 2.44513 10.208 2.44513 6.74146 2.83257C4.72941 3.05745 3.10507 4.64246 2.86852 6.66499C2.45398 10.2093 2.45398 13.7898 2.86852 17.3341C3.10507 19.3567 4.72941 20.9417 6.74146 21.1665C10.208 21.554 13.7914 21.554 17.2579 21.1665C19.27 20.9417 20.8943 19.3567 21.1309 17.3341C21.5454 13.7898 21.5454 10.2093 21.1309 6.66499C20.8943 4.64246 19.27 3.05745 17.2579 2.83257ZM6.90807 4.32329C10.2639 3.94823 13.7355 3.94823 17.0913 4.32329C18.4214 4.47195 19.4869 5.52156 19.641 6.83924C20.042 10.2678 20.042 13.7313 19.641 17.1599C19.4869 18.4775 18.4214 19.5272 17.0913 19.6758C13.7355 20.0509 10.2639 20.0509 6.90807 19.6758C5.57797 19.5272 4.51248 18.4775 4.35837 17.1599C3.95737 13.7313 3.95737 10.2678 4.35837 6.83924C4.51248 5.52156 5.57797 4.47195 6.90807 4.32329Z"
                        fill="black"></path>
                    </svg></a><a aria-label="Facebook" target="_blank"
                    rel="noreferrer" class="Footer_footer__social__aSU18"><svg width="24" height="24"
                      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M10.4877 3.78769C11.4723 2.80312 12.8076 2.25 14.2 2.25H16.9C17.3142 2.25 17.65 2.58579 17.65 3V6.6C17.65 7.01421 17.3142 7.35 16.9 7.35H14.2C14.1602 7.35 14.1221 7.3658 14.0939 7.39393C14.0658 7.42206 14.05 7.46022 14.05 7.5V9.45H16.9C17.131 9.45 17.349 9.5564 17.4912 9.73844C17.6333 9.92048 17.6836 10.1578 17.6276 10.3819L16.7276 13.9819C16.6441 14.3158 16.3442 14.55 16 14.55H14.05V21C14.05 21.4142 13.7142 21.75 13.3 21.75H9.7C9.28579 21.75 8.95 21.4142 8.95 21V14.55H7C6.58579 14.55 6.25 14.2142 6.25 13.8V10.2C6.25 9.78579 6.58579 9.45 7 9.45H8.95V7.5C8.95 6.10761 9.50312 4.77226 10.4877 3.78769ZM14.2 3.75C13.2054 3.75 12.2516 4.14509 11.5483 4.84835C10.8451 5.55161 10.45 6.50544 10.45 7.5V10.2C10.45 10.6142 10.1142 10.95 9.7 10.95H7.75V13.05H9.7C10.1142 13.05 10.45 13.3858 10.45 13.8V20.25H12.55V13.8C12.55 13.3858 12.8858 13.05 13.3 13.05H15.4144L15.9394 10.95H13.3C12.8858 10.95 12.55 10.6142 12.55 10.2V7.5C12.55 7.06239 12.7238 6.64271 13.0333 6.33327C13.3427 6.02384 13.7624 5.85 14.2 5.85H16.15V3.75H14.2Z"
                        fill="black"></path>
                    </svg></a><a aria-label="TikTok" target="_blank"
                    rel="noreferrer" class="Footer_footer__social__aSU18"><svg xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 2882 3333" width="24" height="24" shape-rendering="geometricPrecision"
                      text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd"
                      clip-rule="evenodd">
                      <path
                        d="M2142 77c25 207 94 370 206 483 109 110 262 175 457 187 44 3 77 39 77 82v506c0 45-36 82-81 82-136 13-263-3-390-43-86-27-172-65-261-112v804c0 381-126 686-317 900-140 157-314 266-501 322s-386 60-574 5c-231-67-445-221-597-470C64 2664 8 2472 1 2277c-6-180 28-364 109-530 82-167 210-317 390-427 176-108 402-177 682-187 45-2 83 34 85 79v536c0 43-33 78-75 82-39 7-79 15-119 24-39 9-77 20-114 33-105 35-186 85-234 152-47 65-66 151-50 263 21 151 135 265 270 311 56 19 115 27 172 21 56-6 110-25 158-59 122-87 205-275 180-596V80c0-45 37-82 82-82h523c44 0 79 34 82 77zm89 598c-125-126-206-298-242-510h-370v1809c29 385-85 619-249 737-72 52-153 81-236 90-81 9-165-2-243-29-189-65-348-227-379-444-22-157 8-283 80-382 70-97 179-165 316-211 41-14 84-26 128-37 23-6 45-11 68-15v-378c-210 18-382 75-517 158-151 93-259 218-328 359-69 142-99 299-93 452 6 167 53 331 136 466 129 211 309 342 503 397 157 45 324 42 482-5 158-48 306-140 425-274 166-186 275-453 275-791v-945c0-14 4-29 12-42 23-39 74-52 113-28 124 74 238 131 350 166 85 27 170 40 257 40V905c-201-26-363-104-486-228z"
                        fill-rule="nonzero"></path>
                    </svg></a><a aria-label="WhatsApp" target="_blank" rel="noreferrer"
                    class="Footer_footer__social__aSU18"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"
                      image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
                      <path
                        d="M19.7049 4.19687C17.6473 2.13437 14.9071 1 11.9951 1C5.98437 1 1.0933 5.89107 1.0933 11.9018C1.0933 13.8219 1.5942 15.6978 2.54687 17.3527L1 23L6.77991 21.4826C8.37098 22.3518 10.1634 22.8085 11.9902 22.8085H11.9951C18.0009 22.8085 23 17.9174 23 11.9067C23 8.99464 21.7625 6.25937 19.7049 4.19687ZM11.9951 20.9719C10.3647 20.9719 8.76875 20.5348 7.37902 19.7098L7.05 19.5134L3.62232 20.4121L4.53571 17.0679L4.31964 16.7241C3.41116 15.2804 2.93482 13.6156 2.93482 11.9018C2.93482 6.90759 7.00089 2.84152 12 2.84152C14.421 2.84152 16.6946 3.78437 18.4036 5.49821C20.1125 7.21205 21.1634 9.48571 21.1585 11.9067C21.1585 16.9058 16.9893 20.9719 11.9951 20.9719ZM16.9647 14.1853C16.6946 14.0478 15.354 13.3897 15.1036 13.3013C14.8531 13.208 14.6714 13.1638 14.4897 13.4388C14.308 13.7138 13.7875 14.3228 13.6254 14.5094C13.4683 14.6911 13.3063 14.7156 13.0362 14.5781C11.4353 13.7777 10.3844 13.1491 9.32857 11.3371C9.04866 10.8558 9.60848 10.8902 10.129 9.84911C10.2174 9.66741 10.1732 9.51027 10.1045 9.37277C10.0357 9.23527 9.49062 7.89464 9.26473 7.34955C9.04375 6.8192 8.81786 6.89286 8.65089 6.88304C8.49375 6.87321 8.31205 6.87321 8.13036 6.87321C7.94866 6.87321 7.65402 6.94196 7.40357 7.21205C7.15312 7.48705 6.45089 8.14509 6.45089 9.48571C6.45089 10.8263 7.42813 12.1228 7.56071 12.3045C7.69821 12.4862 9.4808 15.2362 12.2161 16.4196C13.9446 17.1661 14.6223 17.2299 15.4866 17.1022C16.0121 17.0237 17.0973 16.4442 17.3232 15.8058C17.5491 15.1674 17.5491 14.6223 17.4804 14.5094C17.4165 14.3866 17.2348 14.3179 16.9647 14.1853Z"
                        fill-rule="nonzero"></path>
                    </svg></a><a aria-label="Telegram" target="_blank" rel="noreferrer"
                    class="Footer_footer__social__aSU18"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                      width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"
                      image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
                      <path
                        d="M19.5873 4.5C20.4308 4.5 20.6528 5.138 20.4033 6.636C20.1178 8.349 19.2953 14.0205 18.6393 17.551C18.3883 18.902 17.9358 19.4845 17.2773 19.4845C16.9153 19.4845 16.4913 19.3085 16.0043 18.987C15.3443 18.551 12.0123 16.3475 11.2888 15.83C10.6288 15.3585 9.7183 14.791 10.8603 13.674C11.2668 13.276 13.9303 10.7325 16.0053 8.753C16.2268 8.5415 16.0413 8.219 15.7953 8.219C15.7393 8.219 15.6798 8.236 15.6218 8.2745C12.8248 10.1295 8.9463 12.704 8.4528 13.0395C7.9593 13.3745 7.4783 13.5895 6.8373 13.5895C6.5098 13.5895 6.1403 13.5335 5.7058 13.4085C4.7343 13.1295 3.7858 12.797 3.4163 12.67C1.9938 12.182 2.3313 11.5495 3.7128 10.9415C9.2518 8.505 16.4193 5.534 17.4088 5.123C18.3728 4.7225 19.0888 4.5 19.5873 4.5ZM19.5873 3C18.9033 3 18.0798 3.2205 16.8343 3.737L16.6848 3.799C11.3673 6.007 6.5458 8.056 3.1088 9.568C2.5718 9.8045 0.938301 10.523 1.0018 12.026C1.0288 12.6745 1.3858 13.5585 2.9298 14.088L3.0438 14.127C3.4748 14.2755 4.3723 14.585 5.2923 14.8495C5.8523 15.0105 6.3583 15.0885 6.8378 15.0885C7.6698 15.0885 8.3143 14.851 8.8183 14.5745C8.8158 14.6585 8.8178 14.743 8.8243 14.828C8.9153 15.984 9.8093 16.618 10.3433 16.997L10.4178 17.05C11.2063 17.614 14.7748 19.9715 15.1788 20.238C15.9393 20.74 16.6258 20.9835 17.2783 20.9835C18.3043 20.9835 19.6298 20.4355 20.1148 17.8245C20.5753 15.348 21.1073 11.8885 21.4958 9.3625C21.6613 8.2845 21.7973 7.4005 21.8838 6.882C22.0583 5.835 22.1383 4.649 21.4098 3.7895C21.1038 3.4295 20.5398 3 19.5873 3Z"
                        fill-rule="nonzero"></path>
                    </svg></a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</body>
</html>
  `;
  return <div className="PostPreview" dangerouslySetInnerHTML={{ __html: postWithLayout }} />;
}