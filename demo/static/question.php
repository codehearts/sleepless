<?php require_once 'framework.php'; ?>
<?php get_header('Lesson 3 Japanese Vocabulary | Now Studying | Sleepless Demo', '', 'study-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front fade-in">
			<span class="card-field center-field pt-48">兎</span>
		</div>
	</section>
	<section id="back">
		<form method="post" action="answer.php" class="is-muted">
			<button type="submit" class="btn mega-btn" id="show-answer" name="show-answer">Show Answer</button>
		</form>
	</section>
<?php get_footer('study'); ?>