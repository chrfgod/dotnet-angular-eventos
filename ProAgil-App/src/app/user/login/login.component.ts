import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = 'Login';
  model: any = {};

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    if (localStorage.getItem('token') != null){
      this.router.navigate(['/dashboard']);
    }
  }

  // tslint:disable-next-line: typedef
  login(){
    this.authService.login(this.model).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
        this.toastr.success('Logado com Sucesso');
      },
      error => {
        this.toastr.error('Falha ao tentar logar');
      }
    );
  }

}
