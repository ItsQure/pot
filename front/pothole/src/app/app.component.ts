import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      Environment.setEnv({
        // api key for server
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDZzqezgaHyYDf7O_UR54-8XvLed5K1sq4',

        // api key for local development
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDZzqezgaHyYDf7O_UR54-8XvLed5K1sq4'
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }
  ];
}
