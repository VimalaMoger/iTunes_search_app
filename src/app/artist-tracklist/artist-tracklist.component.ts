import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-artist-tracklist',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './artist-tracklist.component.html',
  styleUrl: './artist-tracklist.component.css'
})
export class ArtistTracklistComponent {
  public tracks: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.parent?.params.subscribe(params => {
      this.http
        .get<any>(
          `https://itunes.apple.com/lookup?id=${
            params["artistId"]
          }&entity=song`
        ).subscribe((res:any) => 
             // Success
             this.tracks = res.results.slice(1)
        )
    });
  }

}
 