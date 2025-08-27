(function(){
  const comp = {
    props:{ stepNumber:{type:Number,required:true}, answer:{type:String,default:''}},
    emits:['update:answer'],
    data(){ return { id:'q3', text:'How soon are you looking for offers?', options:['Immediately','1-3 Months','3+ Months'] }; },
    template:`<section :class="$root.panelClasses(stepNumber)" v-show="true" class="space-y-6 bg-white/90 rounded-xl shadow-sm ring-1 ring-slate-200/70 p-5 sm:p-8">
      <h2 class=\"text-2xl font-semibold tracking-tight\">Question 3 of {{$root.questions.length}}</h2>
      <div class=\"space-y-4\">
        <h3 class=\"text-lg font-semibold text-slate-800\">{{ text }}</h3>
        <div class=\"grid sm:grid-cols-2 gap-3\">
          <button v-for=\"opt in options\" :key=\"opt\" type=\"button\" @click=\"$emit('update:answer', opt)\" :class="['rounded-lg border px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-4 focus:ring-primary/30', answer===opt ? 'bg-primary text-white border-primaryDark shadow-sm' : 'bg-white/80 hover:border-primary hover:bg-primary/5 border-slate-300']">{{ opt }}</button>
        </div>
        <p v-if="!answer" class=\"text-sm text-slate-500 italic\">Choose an option to continue</p>
        <div class=\"flex justify-between pt-4\">
          <button type=\"button\" @click=\"$root.prevStep()\" class=\"inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/20 transition\">Back</button>
          <button type=\"button\" @click=\"$root.nextStep()\" :disabled=\"!answer\" :class=\"$root.buttonClass(!answer)\">{{$root.step === $root.lastQuestionStep ? 'Continue' : 'Next'}}</button>
        </div>
      </div>
    </section>`
  };
  (window.__questionComponents = window.__questionComponents || []).push(['question-q3', comp]);
})();
