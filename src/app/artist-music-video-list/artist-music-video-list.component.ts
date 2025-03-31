import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-artist-music-video-list',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './artist-music-video-list.component.html',
  styleUrl: './artist-music-video-list.component.css'
})
export class ArtistMusicVideoListComponent {
  public videos: any[] =[];

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.route.parent?.params.subscribe(params => {
      this.http
        .get<any>(
          `https://itunes.apple.com/lookup?id=${
            params["artistId"]
          }&entity=musicVideo`
        ).subscribe((res:any) =>
          this.videos = res.results.slice(1)
        )
    });
  }
}
