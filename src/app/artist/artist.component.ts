import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

/*ArtistComponent shows some details about an Artist and contains three child components*/
@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.css'
})
export class ArtistComponent {
  private artist: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.http
        .get<any>(
          `https://itunes.apple.com/lookup?id=${params["artistId"]}`
        )
        .subscribe((res : any) =>{
          console.log(res),
          this.artist = res.results.slice(0),
          console.log(this.artist)
        }
        )
    });
  }
}