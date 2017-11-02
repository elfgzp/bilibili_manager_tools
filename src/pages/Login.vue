<template>
  <div class="login-contain">
    <sub-header headerTitle="用户登录"></sub-header>
    <mt-field label="邮箱" placeholder="请输入邮箱" type="email" v-model="email" required></mt-field>
    <mt-field label="密码" placeholder="请输入密码" type="password" v-model="password" required></mt-field>
    <mt-field label="验证码" placeholder="请输入验证码" v-model="captcha" required>
      <img v-bind:src="captchaUrl" height="45px" width="80px" @click="getCaptcha">
    </mt-field>
    <mt-button class="setting-button" size="large" @click.native="handleLogin">登录</mt-button>
  </div>
</template>

<script>
  import {Button, Field, Toast, Indicator} from 'mint-ui'
  import SubHeader from '../components/SubHeader.vue'
  import qs from 'qs'

  export default {
    components: {
      'sub-header': SubHeader,
      'mt-field': Field,
      'mt-button': Button,
    },
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        captcha: '',
        captchaUrl: ''
      }
    },
    mounted: function () {
      this.getCaptcha()
    },
    computed: {},
    methods: {
      getCaptcha: function () {
        var self = this;
        this.$http.get('/get_bilibili_captcha', {}).then(function (response) {
          self.captchaUrl = "data:image/jpeg;base64," + response.data.data.captcha
        })
          .catch(function (error) {
            console.log(error);
            self.captchaUrl = ""
          });

      },
      handleLogin: function () {
        if (this.email === '') {
          return Toast({
            message: '请输入邮箱',
            position: 'bottom',
          });
        }
        let email_reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!email_reg.test(this.email)) {
          return Toast({
            message: '邮箱格式不正确',
            position: 'bottom',
          });
        }
        if (this.password === '') {
          return Toast({
            message: '请输入密码',
            position: 'bottom',
          });
        }
        if (this.captcha === '') {
          return Toast({
            message: '请输入验证码',
            position: 'bottom',
          });
        }
        Indicator.open({
          text: '登录中...',
          spinnerType: 'fading-circle'
        });
        var self = this;
        this.$http.post('/get_bilibili_cookie',
          qs.stringify({
            user: this.email,
            password: this.password,
            captcha: this.captcha
          }),
          {
            headers: {
              content_type: 'application/x-www-form-urlencoded',
            }
          }).then(function (response) {
          console.log(response);
          Indicator.close();
          if (response.data.success === 1) {
            return Toast({
            message: '登录成功',
            position: 'bottom',
          });
          } else {
            return Toast({
            message: response.data.msg,
            position: 'bottom',
          });
          }
        })
          .catch(function (error) {
            console.log(error);
            Indicator.close();
          });
      }
    }
  }
</script>

<style scoped>
  .login-contain {
    height: 100%;
  }

  .setting-button {
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid #ffffff;
    background-color: transparent;
    color: #000000;
  }


</style>
