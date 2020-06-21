import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { flyInOut, expand } from '../animations/app.animation';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {FeedbackService} from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbackcopy: Feedback;
  errMess: string;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  isLoading: boolean;
  isShowingResponse: boolean; 


  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required': 'First name is required',
      'minlength': 'First name must be 2 characters long',
      'maxlength': 'First name can not be more than 25'
    },
    'lastname': {
      'required': 'Last name is required',
      'minlength': 'Last name must be 2 characters long',
      'maxlength': 'Last name can not be more than 25'
    },
    'telnum': {
      'required': 'Tel. number is required',
      'pattern': 'Tel. number must contain only numbers'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email not in valid Format'
    }
    
  }

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) {
    this.createForm();
    this.isLoading = false;
    this.isShowingResponse = false;
   }

  ngOnInit(): void {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: '',
      message: ''
    });

    this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); //(re)set form validation messages
  }

  onValueChanged(data?: any) {
    if(!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for(const field in this.formErrors) {
      if(this.formErrors.hasOwnProperty(field)){
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors ) {
            if ( control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.isLoading= true;
    this.feedback = this.feedbackForm.value;
    this.feedbackService.submitFeedback(this.feedback)
    .subscribe(feedback => {
      this.feedback = feedback;
      console.log(this.feedback);
    },
    errMess => {
      this.feedback=null;
      this.feedbackcopy=null;
      this.errMess = errMess;
    },
    () => {
      this.isShowingResponse = true;
      setTimeout(() => {
          this.isShowingResponse = false;
          this.isLoading = false;
        } , 5000
      );
    });
    
    this.feedbackFormDirective.resetForm();
  }

}
