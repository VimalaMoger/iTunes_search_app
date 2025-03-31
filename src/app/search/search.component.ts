import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, firstValueFrom, map, Observable, switchMap, tap} from 'rxjs';

//Creating SearchItem model
interface SearchItem {
   artistName: string;
   artistId: bigint;
   trackName: string;
}

/* Service uses Http client library to make requests, converts data into model instances*/
@Injectable()
export class SearchService {
  results: [{ [key: string]: SearchItem[] }] = [{}];       
  apiRoot: string = "https://itunes.apple.com/search";
  loading : boolean;

  constructor(private http: HttpClient) {
    this.results = [{}] ;
    this.loading = false;
  }

  /* Handling asynchronous functions via Promises*/
  async searchV1(term: string){
    console.log("GET AS PROMISE");
    let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;   
    var promise = new Promise((resolve, reject) => { //inner function takes two arguments
      this.http.get<any>(apiURL)
      .subscribe((data) => {    
          if(data){ 
            resolve(data.results);
            for (let i = 0; i < data.results.length ; i++) {
              this.results[i] = { artistId : data.results[i]['artistId'], artistName : data.results[i]['artistName'],
              trackName : data.results[i]['trackName']};  
            }  
          }
          else
            reject('error');
      })
    });  
   const res = await promise.then(   //promise chaining
    (res) => {
      console.log(this.results);
      console.log(res);
    },       
    (err) => console.error(err)
  ).catch((err) => console.error(err)); 
  } 

//using firsValueFrom- subscribes to observable, converts  to promise, returns promise -resolves to first value from observable
  searchV2(term: string) {
    return new Promise((resolve,reject)=>{
      let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
      firstValueFrom(this.http.get<any>(apiURL)).then((res)=>{
  
        console.log(res);
        console.log(res.results.length);
      
        for (let i = 0; i < res.results.length ; i++) {
          this.results[i] = { artistId : res.results[i]['artistId'], artistName : res.results[i]['artistName'],
            trackName : res.results[i]['trackName']};  
        }   
        //resolve(res);
      },(error)=>{
        reject(error);
      });
    });
  } 

//using Observable that returns Observable<any> 
  searchV3(term: string):Observable<any>{
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin','https://itunes.apple.com');
    let apiURL = `${this.apiRoot}?term=${term}&media=music&limit=20`;
    return this.http.get<any>(apiURL, {headers});
  }
}

@Injectable({providedIn : 'root'})
export class UserService {
  isLoggedIn(): boolean {
    return true; // Switch to `false` to make OnlyLoggedInUsersGuard work- as logged
  }
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent implements OnInit{
  //adding a Loading indicator to template
  loading: boolean = true;
  //storing the results locally 
  results?: Observable<any>;
  results$: [{ [key: string]: SearchItem[] }] = [{}]; 
  searchField!: FormControl;   //form instance 
  //import and inject AcivatedRoute into constructor
  constructor(public itunes: SearchService, private route: ActivatedRoute, private router : Router){ //this route exposes observable that we subscribe to
    this.route.params.subscribe(params => {
      console.log(params);
      if (params["term"]) {
        this.doSearch(params["term"]);
      }
    })
  };

  ngOnInit() {
    this.searchField = new FormControl();
    //form instance exposes an observable via it's valueChanges property
    this.results = this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.loading =true),
      switchMap((term) => this.itunes.searchV3(term).pipe(map((res) => res.results
      ))),
      tap(() => this.loading = false))
  }

  doSearch(term:string){
    this.loading= true;
    this.onSearch(term);     
  }

  onSearch(term: string){
    
    //this.itunes.searchV1(term).then((_: any) => (this.loading = false));//calls searchV1
    //this.itunes.searchV3(term).subscribe((res) => {this.loading= false, this.results$= res.results})

    //subscribe to- Observable return    
    this.itunes.searchV3(term).subscribe((res:any)=> {
      this.loading = false;
      for (let i = 0; i < res.results.length ; i++) {
        this.results$[i] = { artistId : res.results[i]['artistId'], artistName : res.results[i]['artistName'],
          trackName : res.results[i]['trackName']};  
      }
    });    
  }
}
