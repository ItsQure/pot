import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Router} from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {API_CONFIG} from './ENVIR_KEY';

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
  
    constructor(private geolocation: Geolocation, private router: Router, private iab: InAppBrowser) {
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
          /*
          this.markerOptions.position = current_pos;
          this.markerOptions.map = this.map;
          this.markerOptions.title = 'My Location';
          this.marker = new google.maps.Marker(this.markerOptions);
          */

          var example_address = "1109 Highland Ave. Apt 11302 Knoxville, TN";
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

  Geocode_Parse(addresses) {
    var currAddress, coords = [];
    var current_post = new google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng);
    coords.push(current_post);
    for (var i = 0; i < addresses.length; i++) {
        currAddress = addresses[i];
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({'address':currAddress}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    coords.push(results[0].geometry.location);

                    // Check if all calls have been processed
                    if (coords.length == addresses.length+1) {
                      //consider the destinations var to be a list of LatLng objects:
                        var base_url = "https://www.google.com/maps/dir/";
                        var i;
                        console.log("geo:");
                        console.log(coords);
                        for(i=0; i < coords.length; i++){ 
                          var lat = coords[i].lat();
                          var long = coords[i].lng();
                          console.log("lat: " + lat + " long: " + long);
                          base_url += lat+","+long+"/";
                        }
                        window.open(base_url, '_system');
                    }
                }
            });
        }
    }
  }

  clickGoogleMap(){
    //var url = "https://www.google.com/maps/dir/35.9635325,-83.9178258/35.9733887,-83.9322847/35.9639804,-83.9360541/35.96306,-83.9516563/35.987854,-83.9785725/35.9749142,-83.977229";
    //https://www.google.com/maps/dir/35.9625505,-83.91618310000001/35.961694,-83.92322100000001/35.957471,-83.93659500000001/35.9542795,-83.93888520000002/
    //var url = this.createGoogleURL(this.createCoordinates(this.listDests));
    this.Geocode_Parse(this.listDests);
  }

  createGoogleURL(geo_dests){
      //consider the destinations var to be a list of LatLng objects:
      var base_url = "https://www.google.com/maps/dir/";
      var i;
      console.log("geo:");
      console.log(geo_dests);
      for(i=0; i < geo_dests.length; i++){ 
        var lat = geo_dests[i].lat();
        var long = geo_dests[i].lng();
        console.log("lat: " + lat + " long: " + long);
        base_url += lat+","+long+"/";
      }
      return base_url;
  }

}