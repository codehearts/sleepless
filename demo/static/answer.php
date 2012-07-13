<?php require_once 'framework.php'; ?>
<?php get_header('Lesson 3 Japanese Vocabulary | Now Studying | Sleepless Demo', '', 'study-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front">
			<span class="card-field center-field pt-48">兎</span>
		</div>
	</section>
	<section id="back" class="fade-in">
		<div class="card one-sided-card">
			<div class="card-back">
				<span class="card-field center-field pt-24">rabbit</span>
				<span class="card-field small-field center-field pt-14">うさぎ</span>
			</div>
		</div>
		
		<form method="post" action="question2.php">
			<button type="submit" class="btn bad-btn large-btn" name="repeat" id="repeat">Repeat</button>
			<div class="good-review-delay-options">
				<p class="review-delay-caption">Review in</p>
				<button type="submit" class="btn good-btn large-btn" name="short-review-delay"><span class="button-numeral">27</span> days</button>
				<button type="submit" class="btn good-btn large-btn" name="medium-review-delay"><span class="button-numeral">5.3</span> months</button>
				<button type="submit" class="btn good-btn large-btn" name="long-review-delay"><span class="button-numeral">11.7</span> years</button>
			</div>
		</form>
	</section>
<?php get_footer('study'); ?>