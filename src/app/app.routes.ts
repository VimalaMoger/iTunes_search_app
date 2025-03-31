import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { ArtistComponent } from './artist/artist.component';
import { ArtistAlbumListComponent } from './artist-album-list/artist-album-list.component';
import { ArtistTracklistComponent } from './artist-tracklist/artist-tracklist.component';
import { ArtistMusicVideoListComponent } from './artist-music-video-list/artist-music-video-list.component';
import { AlwaysAuthChildrenGuard, OnlyLoggedInUsersGuard } from './app.component';

export const routes: Routes =   [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, //Adding a default route
    { path: 'find', redirectTo: 'search'}, 
    { path: 'home', component: HomeComponent},
    
    { path: 'search/:term', component: SearchComponent},
    { path: 'searchitem', component: SearchComponent},
    {
      path: "artist/:artistId",    //:artistId is a placeholder for a specific artist Id
      component: ArtistComponent, canActivate :[OnlyLoggedInUsersGuard], canActivateChild : [AlwaysAuthChildrenGuard],
      children: [
        { path: "", redirectTo: "tracks", pathMatch: "full" },
        { path: "tracks", component: ArtistTracklistComponent },
        { path: "albums", component: ArtistAlbumListComponent },
        { path: "videos", component: ArtistMusicVideoListComponent }
      ]
    },
    { path: '**', component: HomeComponent}
]
