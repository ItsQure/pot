import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {API_CONFIG} from './ENVIR_KEY';
import {DataTransferService} from '../data-transfer.service';

declare var google;
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {
    apiKey = API_CONFIG;
    @ViewChild('map') googleMap;
    mapElement: any;
    map: any;
    mapOptions: any;
    mapCenter = {lat: null, lng: null};
    markerOptions: any = {position: null, map: null, title: null};
    marker: any;
    geo_code: any = [];
    //temp:
    listDests = ["810 Clinch Ave, Knoxville, TN 37902","1901 W Clinch Ave, Knoxville, TN 37916","2135 Cumberland Ave, Knoxville, TN 37916"];
    //listDests = [];

    constructor(private geolocation: Geolocation, private router: Router, private iab: InAppBrowser, private data: DataTransferService) {
      //this.listDests = this.data.storage
      const script = document.createElement('script');
      script.id = 'googleMap';
      if (this.apiKey) {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey;
      } else {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=';
      }
      document.head.appendChild(script);
      this.geolocation.getCurrentPosition().then((resp) => {
        this.mapCenter.lat = resp.coords.latitude;
        this.mapCenter.lng = resp.coords.longitude;
          // resp.coords.latitude
          // resp.coords.longitude
      }).catch((error) => {
          console.log('Error getting location', error);
      });
  }

  ngAfterViewInit(): void {
      this.mapElement = this.googleMap.nativeElement;
      this.mapOptions = {
          center: this.mapCenter,
          zoom: 10,
          disableDefaultUI: true,
      };

      setTimeout(() => {
          this.map = new google.maps.Map(this.mapElement, this.mapOptions);

          var opt = { minZoom: 10};
          this.map.setOptions(opt);
          
          var current_pos = new google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng);
          var directionsService = new google.maps.DirectionsService;
          var directionsDisplay = new google.maps.DirectionsRenderer;
          
          directionsDisplay.setMap(this.map);
          this.calculateAndDisplayRoute(directionsService, directionsDisplay, current_pos, this.listDests);

      }, 2000);

  }

  calculateAndDisplayRoute(directionsService, directionsDisplay, origin_coordinate, dest_coordindate) {
    //assume dest is a list
    //process list here:
    var processed_list = [];
    for(var i=0; i < dest_coordindate.length; i++){
      var WayPoint = {location:dest_coordindate[i], stopover: false};
      processed_list.push(WayPoint);
    }

    directionsService.route({
      origin: origin_coordinate,
      destination: dest_coordindate[dest_coordindate.length-1],
      waypoints: processed_list,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        //window.alert('Directions request failed due to ' + status);
      }
    });
  }

  back(){
    this.router.navigate(['home']);
  };

  loadLocations(list_address){
      //WIP
  };

  geocodeLatLng(listDest) {
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat: this.mapCenter.lat, lng: this.mapCenter.lng};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          var first = results[0].formatted_address;
          var base_url = "https://www.google.com/maps/dir/?api=1";
          var param_url = "";

          param_url += "&dir_action=navigate&origin=" + encodeURIComponent(first);

          console.log(listDest);

          if(listDest.length > 1){
            param_url += "&waypoints=" + encodeURIComponent(listDest[0]);
          }

          for(var i=1; i < listDest.length-1; i++){ 
            var place = encodeURIComponent(listDest[i]);
            param_url += "|" + place;
          }

          if(listDest.length != 0){
            param_url += "&destination=" + encodeURIComponent(listDest[listDest.length-1]);
          }

          base_url += param_url;
          console.log("base_url: " + base_url);
          window.open(base_url, '_system');
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }



  clickGoogleMap(){
    //var url = "https://www.google.com/maps/dir/35.9635325,-83.9178258/35.9733887,-83.9322847/35.9639804,-83.9360541/35.96306,-83.9516563/35.987854,-83.9785725/35.9749142,-83.977229";
    //https://www.google.com/maps/dir/35.9625505,-83.91618310000001/35.961694,-83.92322100000001/35.957471,-83.93659500000001/35.9542795,-83.93888520000002/
    //var url = this.createGoogleURL(this.createCoordinates(this.listDests));
    this.geocodeLatLng(this.listDests);
  }
}