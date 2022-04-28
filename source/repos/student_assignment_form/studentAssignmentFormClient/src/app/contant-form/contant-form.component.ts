import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { IStudent } from '../models/student';
import { StudentsApiService } from '../services/students-api.service';

@Component({
  selector: 'app-contant-form',
  templateUrl: './contant-form.component.html',
  styleUrls: ['./contant-form.component.css']
})
export class ContantFormComponent implements OnInit {
  Personal_Information!: FormGroup;
  err = {identify: ' שדה חובה',
   mobile:' הכנס טלפון תקין', 
   homeNumber:' השדה חייב להכיל אך ורק מספרים ולהתחיל ב-0',
   lastName:' שדה חובה',
   firstName:' שדה חובה',
   institution:' שדה חובה',
   birthday:' שדה חובה',
   gender:' שדה חובה',
   email:' שדה מייל חייב להכיל את התו שטרודל ונקודה ',
   country:' שדה חובה'
  }
  constructor(private formBuilder : FormBuilder,private studentApi: StudentsApiService) {

   }
  
  ngOnInit(): void {
    this.intitializeForm();
  }

  intitializeForm() {
  this.Personal_Information =this.formBuilder.group({
    identify: new FormControl('', [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    birthday: new FormControl('',[Validators.required]),
    homeNumber: new FormControl('',[Validators.pattern(/^-?(0[1-9]\d*)?$/)]),
    mobile: new FormControl('', [Validators.required, Validators.pattern(/^-?(05|[1-9]\d*)?$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    country: new FormControl('', [Validators.required]),
    immigration: new FormControl(''),
    nation: new FormControl(''),

  })
  }
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  } 



  onSubmit():void{
    this.err;
    const student :IStudent = {
      identify: this.Personal_Information.controls.identify.value,
      firstName: this.Personal_Information.controls.firstName.value,
      lastName: this.Personal_Information.controls.lastName.value,
      gender: this.Personal_Information.controls.gender.value,
      institution: this.Personal_Information.controls.institution.value,
      birthday: this.Personal_Information.controls.birthday.value,
      homeNumber: this.Personal_Information.controls.homeNumber.value,
      mobile: this.Personal_Information.controls.mobile.value,
      email: this.Personal_Information.controls.email.value,
      country: this.Personal_Information.controls.country.value,
      immigration: this.Personal_Information.controls.immigration.value,
      nation: this.Personal_Information.controls.nation.value,
      Register: true
    }

    this.studentApi.updateStudentsList(student).subscribe(data => {
      console.log(data);
      if(data.error && data.error != ""){
        alert("הסטודנט לא קיים");
      }
      else{
        this.studentApi.getStudent().subscribe()
        alert('הסטודנט התווסף בהצלחה')
      }
    })
  }
}
