
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { templateJitUrl } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  title = 'Eventos';

  eventosFiltrados: Evento [];
  eventos: Evento [];
  evento: Evento;
  modoSalvar = 'post';
  imagemLargura = 50;
  imagemMargem = 2;
  registerForm: FormGroup;
  bodyDeletarEvento = '';

  file: File;

  // tslint:disable-next-line: variable-name
  _filtroLista = '';
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private localeService: BsLocaleService){ 
      this.localeService.use('pt-br');
    }

  get filtroLista(): string{
    return this._filtroLista;
  }
  set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  // tslint:disable-next-line: typedef
  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }
  // tslint:disable-next-line: typedef
  novoEvento(template: any){
    this.modoSalvar = 'post';
    this.openModal(template);

  }

  // tslint:disable-next-line: typedef
  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  // tslint:disable-next-line: typedef
  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, ID: ${evento.id}`;
  }

  // tslint:disable-next-line: typedef
  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com sucesso');
        }, error => {
          this.toastr.error(`Erro ao deletar ${error}`);
          console.log(error);
        }
    );
  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  // tslint:disable-next-line: typedef
  validation(){
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // tslint:disable-next-line: typedef
  onFileChange(event){
    const reader = new FileReader();

    if (event.target.files && event.target.files.length){
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  // tslint:disable-next-line: typedef
  uploadImagem(){
    if (this.modoSalvar === 'post'){
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];
      this.eventoService.postUpload(this.file, nomeArquivo[2])
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
    else {
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }

      );
    }
  }

  // tslint:disable-next-line: typedef
  salvarAlteracao(template: any){
    if (this.registerForm.valid){
      if (this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);
        this.uploadImagem();
        this.eventoService.postEvento(this.evento).subscribe(
        (novoEvento: Evento) => {
          template.hide();
          this.getEventos();
          this.toastr.success('Inserido com sucesso');
        }, error => {
          this.toastr.error(`Erro ao inserir ${error}`);
          console.log(error);
        }
      );

      } else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
        () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Editado com sucesso');
        }, error => {
          this.toastr.error(`Erro ao editar ${error}`);
          console.log(error);
        }
      );

      }
    }
  }
  // tslint:disable-next-line: typedef
  getEventos(){
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line: variable-name
      (_eventos: Evento[]) => {
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
    }, error => {
      this.toastr.error(`Erro ao tentar carregar eventos ${error}`);
    });
  }
}
