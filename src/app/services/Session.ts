import { Ability, AbilityBuilder } from '@casl/ability';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class Session {
  token!: any;

  constructor(private ability: Ability, private router: Router) {}

  login(details: any) {
    const params = { method: 'POST', body: JSON.stringify(details) };
    return fetch('http://196.43.196.108:3345/authenticate', params)
      .then((response) => response.json())
      .then((session) => {
        localStorage.setItem('user', JSON.stringify(session.user));
        this.updateAbility(localStorage['user']);
        this.token = session.token;
        this.router.navigate(['/posts']);
      });
  }

  private updateAbility(user: any) {
    const { can, rules } = new AbilityBuilder(Ability);

    if (user.role.title === 'Store Manager') {
      can('manage', 'all');
      console.log('super');
    } else {
      can('read', 'all');
    }

    this.ability.update(rules);
  }

  logout() {
    this.token = null;
    this.ability.update([]);
  }
}
