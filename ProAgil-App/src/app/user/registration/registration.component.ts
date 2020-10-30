import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  user: User;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
    ) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {

    this.validation();

  }

  // tslint:disable-next-line: typedef
  cadastrarUsuario(){
    if (this.registerForm.valid) {
      this.user = Object.assign({password: this.registerForm.get('passwords.password').value}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastrado realizado');
        },
        error => {
          const erro = error.error;
          erro.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Cadastro duplicado');
                break;
              default:
                this.toastr.error(`Erro no cadastro: ${element.code}`);
                break;
            }

          });

        }

      );
    }
  }

  // tslint:disable-next-line: typedef
  compararSenhas(fb: FormGroup){
    const confirmSentraCtrl = fb.get('confirmPassword');
    if (confirmSentraCtrl.errors == null || 'mismatch' in confirmSentraCtrl.errors){
      if (fb.get('password').value !== confirmSentraCtrl.value){
        confirmSentraCtrl.setErrors({mismatch: true});
      }
      else {
        confirmSentraCtrl.setErrors(null);
      }
    }
  }

  validation(){
    this.registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', Validators.required],

    passwords: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.compararSenhas })

    });
  }


}
