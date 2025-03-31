import { Component, Injectable} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CanActivate, CanActivateChild, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { UserService } from './search/search.component';

//Router Guards
//lets the user if logged in returns true
@Injectable({providedIn:'root'})
export class OnlyLoggedInUsersGuard implements CanActivate {  
  constructor(private userService: UserService, private router: Router) {}; 

  canActivate() {
    console.log("OnlyLoggedInUsers");
    if (this.userService.isLoggedIn()) { 
      return true;
    } else {
      //window.alert("You don't have permission to view this page"); 
      this.router.navigate([""]);
      return false;
    }
  }
} 
//lets render the child components
@Injectable({providedIn:'root'}) 
export class AlwaysAuthChildrenGuard implements CanActivateChild {
  canActivateChild() {
    console.log("AlwaysAuthChildrenGuard");
    return true;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterOutlet, RouterModule, HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:  []
})
export class AppComponent {}