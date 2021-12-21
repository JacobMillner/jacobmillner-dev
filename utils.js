function cowsay() {
  // Ah! You tracked down the cow. congratulations.
  // I probably spent way to much time on this...
  // Sometimes I just get a silly idea and I can't let it go.
  // But anyway thanks for looking at this, it makes the time I spent
  // worth just a little more.
  const myDate = new Date();
  const hrs = myDate.getHours();
  const greetings = ['おはよう！！', 'こんにちは！', 'こんばんは！'];
  const stillHere = '彼らはまだここにいます...';
  var greet;

  if (hrs < 12) greet = greetings[0];
  else if (hrs >= 12 && hrs <= 17) greet = greetings[1];
  else if (hrs >= 17 && hrs <= 24) greet = greetings[2];

  // look at this beauty!
  const cow = (say) =>
    '<pr>\n' +
    '______________\n' +
    '< ' +
    say +
    ' >\n' +
    '--------------\n' +
    '\\   ^__^\n' +
    '         \\  (oo)\\_______\n' +
    '                (__)\\       )\\/\\\n' +
    '                ||----w |\n' +
    '                ||     ||\n' +
    '</pr>';

  var cowContainer = document.getElementById('cowsay');
  cowContainer.innerHTML = cow(greet);

  // after 2 minutes lets give them a new message
  setTimeout(() => {
    greet = stillHere;
    cowContainer = document.getElementById('cowsay');
    cowContainer.innerHTML = cow(greet);
  }, 120000);
}

function goAwayBots() {
  // maybe this will stop the spam
  const username = 'jacobdonaldmillner';
  const hostname = 'gmail.com';
  const linktext = username + '@' + hostname;
  const emailContainer = document.getElementById('email');
  emailContainer.innerHTML =
    "<a href='" +
    'mail' +
    'to:' +
    username +
    '@' +
    hostname +
    "'>" +
    linktext +
    '</a>';
}
